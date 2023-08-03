import axios from 'axios';
import TriangleBlur from '../../../../assets/SvgBackground/TriangleBlur';
import API_URL from '../../../API_URL';
import InputDocumentForm from './Form/InputDocumentForm';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { XMarkIcon } from '@heroicons/react/24/solid';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import { Wallet } from '../../../../@types/index';
import { getAPI } from '../../../../utils/config';

interface Document {
  id: number;
  name: string;
  information: string;
  date: string;
  type: string;
  walletId: string;
}

function WalletDocumentsPage() {
  const { walletId } = useParams<{ walletId: string }>();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [submittedDocuments, setSubmittedDocuments] = useState([]);
  const [pdfFile, setPdfFile] = useState({});
  const [wallet, setWallet] = useState<Wallet[]>([]);

  const getOneWallet = async () => {
    try {
      const { data } = await getAPI().get<Wallet[]>(`/wallet/${walletId}`);
      setWallet(data);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération du portefeuille :",
        error
      );
    }
  };

  const getDocuments = async () => {
    try {
      const { data } = await getAPI().get<Document[]>(
        `/wallet/${walletId}/document`
      );
      setDocuments(data);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des documents :",
        error
      );
    }
  };

  // Fonction pour ajouter un nouveau document soumis
  const addDocument = async (
    newDocument: string | Blob,
    documentDetails: { name: string | Blob; information: string | Blob }
  ) => {
    try {
      const formData = new FormData();
      formData.append('uploaded_file', newDocument);
      formData.append('name', documentDetails.name);
      formData.append('information', documentDetails.information);

      const { data } = await getAPI().post(
        `/wallet/${walletId}/document`,
        formData,
        {
          // Ici, on précise le type de contenu de la requête, pour que le serveur sache comment traiter les données, ici, un fichier.
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setDocuments(data);
      getDocuments();
    } catch (error) {
      console.error('Erreur lors de la création du document :', error);
    }
  };

  const deleteDocument = async (documentId: number) => {
    try {
      const { data } = await getAPI().delete(`/wallet/document/${documentId}`);
      setDocuments(documents.filter((document) => document.id !== documentId));
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression du document :",
        error
      );
    }
  };

  // Add this state variable
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPdfFile({});
  };

  const previewFile = async (documentId: number) => {
    try {
      const { data } = await getAPI().get(`/wallet/document/${documentId}`);
      const type = data[0].type;
      if (type.startsWith('image/')) {
        const imageFileImport = await import(
          `../../../../../uploads/${data[0].file}`
        );
        const pdfFile = imageFileImport.default;
        console.log('pdfFile:', pdfFile);
        setPdfFile((prevPdfFiles) => ({
          ...prevPdfFiles,
          [documentId]: pdfFile,
        }));
        setIsPreviewOpen(true);
      } else if (type === 'application/pdf') {
        const pdfFileImport = await import(
          `../../../../../uploads/${data[0].file}`
        );
        const pdfFile = pdfFileImport.default;
        setPdfFile((prevPdfFiles) => ({
          ...prevPdfFiles,
          [documentId]: pdfFile,
        }));
        setIsPreviewOpen(true);
      } else {
        console.error('Type de fichier non pris en charge :', type);
        return;
      }
    } catch (error) {
      console.error('Erreur lors du chargement du fichier :', error);
    }
  };

  const downloadFile = async (documentId: number) => {
    try {
      const response = await getAPI().get(
        `/wallet/document/${documentId}/download`,
        {
          responseType: 'blob',
        }
      );

      const { data } = await getAPI().get(`/wallet/document/${documentId}`);
      const fileName = data[0].name;
      const type = data[0].type;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log('url:', url);
      const link = document.createElement('a');
      link.href = url;

      const fileExtension = `${fileName}.${type}`;
      link.setAttribute('download', fileExtension);

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du télechargement du document:",
        error
      );
    }
  };

  useEffect(() => {
    getDocuments();
    getOneWallet();
  }, []);

  const walletName = wallet.map((wallet) => wallet.name);

  return (
    <div>
      <TriangleBlur />
      <div className="max-md:px-4 flex items-center flex-col pt-20 h-screen bg-base-200 z-10  ">
        <h1 className="text-5xl font-bold pb-10">{walletName}</h1>

        <InputDocumentForm
          onSubmit={addDocument}
          documentInformationFromInput={setSubmittedDocuments}
        />

        <div className="card max-md:w-full w-1/2 bg-base-100 shadow-xl">
          {documents.map((document) => (
            <div
              key={document.id}
              id={document.id.toString()}
              className="flex justify-between items-center max-lg:h-32 h-14 px-4 border-b-2 "
            >
              <div className="w-4/6 max-lg:h-full max-lg:flex  max-lg:flex-col max-lg:justify-around max-lg:px-1 px-5 border-r-2 ">
                <div className="flex justify-between">
                  <p className="uppercase">{document.name}</p>
                  <p className="text-sm">
                    {document.date && document.date.substring(0, 10)}
                  </p>
                </div>
                <p className="text-slate-400 text-sm">{document.information}</p>
              </div>

              <div className="card-actions justify-around">
                {!isPreviewOpen && (
                  <button className="btn bg-[var(--color-primary-300)] text-white">
                    <p onClick={() => previewFile(document.id)}>Ouvrir</p>
                  </button>
                )}
                {isPreviewOpen &&
                  pdfFile[document.id] &&
                  !pdfFile[document.id].endsWith('.pdf') && (
                    <div className="w-screen h-screen fixed left-0 top-0 flex justify-center bg-slate-50 overflow-scroll ">
                      <div className=" absolute mt-10 w-5/6">
                        <p className="text-2xl uppercase flex justify-center pb-5">
                          {document.name}
                        </p>
                        <img
                          src={pdfFile[document.id]}
                          alt={`Document ${document.name}`}
                        />
                        <button
                          className="border rounded-lg bg-[var(--color-primary-500)] absolute top-2 right-2 z-50 text-white"
                          onClick={closePreview}
                        >
                          <XMarkIcon className="w-8 h-8 text-white stroke-2 " />
                        </button>
                      </div>
                    </div>
                  )}
                {pdfFile[document.id] &&
                  pdfFile[document.id].endsWith('.pdf') && (
                    <div className="w-screen h-screen fixed left-0 top-0 flex justify-center bg-slate-50 overflow-scroll ">
                      <div className=" absolute mt-40">
                        <p className="text-2xl uppercase flex justify-center pb-5">
                          {document.name}
                        </p>
                        <Document file={pdfFile[document.id]}>
                          <Page pageNumber={1} />
                        </Document>
                        <button
                          className="border rounded-lg bg-[var(--color-primary-500)] absolute top-2 right-2 z-50 text-white"
                          onClick={closePreview}
                        >
                          <XMarkIcon className="w-8 h-8 text-white stroke-2 " />
                        </button>
                      </div>
                    </div>
                  )}
              </div>

              <div className="card-actions justify-around">
                <button className="" onClick={() => downloadFile(document.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </button>
              </div>
              <div className="card-actions justify-around">
                <button
                  className=""
                  onClick={() => deleteDocument(document.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WalletDocumentsPage;

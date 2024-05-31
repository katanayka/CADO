"use client";
import GraphRedactor from "@/components/discipline/redactor/graph_redactor";
import Toolbar from "@/components/discipline/redactor/toolbar";
import nodeTypesRedact from "@/data/NodeTypesRedact";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import "reactflow/dist/style.css";
import { ReactFlowProvider } from "reactflow";
import Breadcrumbs from "@/components/discipline/breadcrumbs";
import { EnsembleTree, Node, Tree } from "@/services/treeSctructure";
import { Provider } from 'react-redux'
import { store } from '@/store'
import axios from "axios";
import Modal from '@mui/material/Modal';
import { Box, Fade, Typography } from "@mui/material";
import { FileInput, Button } from "react-daisyui";
interface ParamProps {
  disciplineId: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Page({ params }: Readonly<{ params: ParamProps }>) {
  const [sharedData, setSharedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<EnsembleTree<any> | null>(null);
  const [file, setFile] = useState<File | null>(null)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const Files = e.target.files
    if (Files?.length) {
      setFile(Files[0])
    }
  }
  const handleLoad = async () => {
    if (file?.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post('/api/readPDF', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        const data = response.data;
        const idGen = (() => {
          let id = 0;
          return () => `${file.name}_${id++}`;
        })();

        const root = new Node(idGen(), data.title, "Rewritable");
        const addChildrenToNode = (parentNode, data, idGen) => {
          for (const [title, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
              // Create a new node for the title
              const curId = idGen();
              const childNode = new Node(curId, title, "Rewritable");

              // Add the first element of the array as the data for the child node
              childNode.data = value[0];

              // Add the child node to the parent node
              parentNode.children.push(childNode);

              // Prepare children data for recursion
              const childrenData = value.slice(1).reduce((acc, item) => {
                if (typeof item === 'string') {
                  acc[title] = acc[title] || [];
                  acc[title].push(item);
                } else if (typeof item === 'object') {
                  acc = { ...acc, ...item };
                }
                return acc;
              }, {});

            }
          }
        };
        addChildrenToNode(root, data, idGen);
        const tree = new Tree<any>();
        tree.root = root;
        console.log(tree)
        // Create recursive function to add children to node
        // Format data to Tree format (currently it dict, with name of title as key and text inside and children as value, where children is array of titles with text inside (recursive))
      } catch (error) {
        console.error(error);
      }
    }
  }
  async function fetchData() {
    const res = await axios.get(
      `/api/discipline/data?discipline=${(params.disciplineId)}`
    );
    if (res.status === 200) {
      const data = await res.data;
      const ensemble = new EnsembleTree<any>(data.dataTree);
      setData(ensemble);
      console.log(ensemble);
    }
  }
  // Make sure to call fetchData() only once
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="m-0 p-0 h-full">
      <Modal open={open} onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" className="text-center">
              Импортировать книгу на график
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }} className="py-4">
              Выберите необходимую книгу, для импорта ключевой информации на график.
            </Typography>
            <FileInput onChange={(e) => { handleFileChange(e) }} className="max-w-full" />
            <Typography className="text-gray-500 text-center pt-4">
              Необходимо использовать только книги в формате PDF
            </Typography>
            <div className="flex items-center justify-center p-4">
              <Button className="" onClick={handleLoad}>
                Отправить
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <div className="content flex h-full">
        <Toolbar disciplineId={params.disciplineId} sharedData={sharedData} />
        <div className="about bg-orange-700 w-full">
          <div className="ourBlock" style={{ height: "96%" }}>
            <div className="absolute z-20 flex gap-32 items-center">
              <Breadcrumbs items={[
                { href: "/", label: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
                { href: `/disciplines/${params.disciplineId}`, label: decodeURIComponent(params.disciplineId), icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
                { label: "Add Document", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> },
              ]} />
              <button onClick={handleOpen}>
                Импортировать книгу
              </button>
            </div>
            <div className="h-full" id="flow">
              <Provider store={store}>
                <ReactFlowProvider>
                  <GraphRedactor setSharedData={setSharedData} dataTree={data} />
                </ReactFlowProvider>
              </Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

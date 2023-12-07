import client from "./client";
// import { getToken } from '../utils/token';

const getOkKos = () => client.get("/tournoi");

const getOkKo = (i) => client.get("/tournoi/"+i);

const postOkKo = (data) => client.post("/tournoi/", data);

const putOkKo = (id, data) => client.put(`/tournoi/${id}`, data);

const deleteOkKo = (id) => client.delete(`/tournoi/${id}`);

export default {
  getOkKo,
  getOkKo,
  postOkKo,
  putOkKo,
  deleteOkKo
};

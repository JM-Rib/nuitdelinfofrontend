import client from "./client";

const getAdmins = () => client.get("/admin");

const getAdmin = (i) => client.get("/admin/"+i);

const postAdmin = (data) => client.post("/admin/", data);

const putAdmin = (id, data) => client.put(`/admin/${id}`, data);

const deleteAdmin = (id) => client.delete(`/admin/${id}`);

const verifyAdmin = (token) => client.get("/admin/verify/", {headers: {'Authorization': `Bearer ${token}`}});

const loginAdmin = (data) => client.post("/admin/login", data);

export default {
  getAdmins,
  getAdmin,
  postAdmin,
  putAdmin,
  deleteAdmin,
  verifyAdmin,
  loginAdmin
};

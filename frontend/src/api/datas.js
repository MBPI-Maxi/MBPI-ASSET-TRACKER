import axios from "axios";

function getDepartments() {
  return axios
    .get("http://localhost:3001/departments")
    .then(res => res.data)
    .catch(console.error)
}

export default getDepartments;
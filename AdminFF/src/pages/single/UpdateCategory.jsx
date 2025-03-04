import "./updatecategory.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/Config";
import { useParams } from "react-router-dom";

const UpdateCategory = ({ inputs, title }) => {
  const { categoryId } = useParams();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    imagePath: ""
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category/${categoryId}`, {
          headers: {
            "Content-Type": "application/json",
          }
        });
        const category = response.data.category;
        setFormData({
          categoryName: category.categoryName,
          imagePath: category.imagePath
        });
      } catch (error) {
        console.error("There was an error fetching the category data!", error);
      }
    };
    fetchCategoryData();
  }, [categoryId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    console.log(`Updated ${id} to:`, value); // Log each updated value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Process fields before adding to FormData
    const processedData = {
      categoryName: formData.categoryName,
    };

    for (const key in processedData) {
      data.append(key, processedData[key]);
    }

    if (file) {
      data.append("image", file);
    }

    // Log all form data before sending
    for (let pair of data.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.put(`${BASE_URL}/category/update-category/${categoryId}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data);
      window.location.href = '/categories';
    } catch (error) {
      console.error("There was an error updating the category!", error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : formData.imagePath || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="Category"
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    id={input.id}
                    name={input.id}
                    placeholder={input.placeholder}
                    value={formData[input.id]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;

export const categoryInputs = [
  {
    id: "categoryName",
    label: "Category Name",
    type: "text",
    placeholder: "Enter category name",
  },
];

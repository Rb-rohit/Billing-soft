import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    barcode: "",
    price: "",
    stock: ""
  });

  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const token = localStorage.getItem("token");

  // fetch product
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products?page=${page}&limit=5`,{
      headers: {Authorization: `Bearer ${token}` }
    });
    setProducts(res.data.products || []);
    setPages(res.data.pages || 1);
    }catch (error) {
      console.log(error.response?.data || error.message);
      setProducts([]); 
    }
    
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  //handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //add/ Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/products/${editId}`,
          form,
          {headers: {Authorization: `Bearer ${token}`} }
        )
          .then(() => {
            toast("Product Data Edited");
          });
        setEditId(null);
      }else {
        await axios.post(
          "http://localhost:5000/api/products/add",
          form,
          { headers: {Authorization: `Bearer ${token}`} }
        )
          .then(() => {
            toast("Product Add");
          })
          .catch((error) => {
            toast("Product Could not Add");
            console.log(error);
          });
      }

      setForm({ name: "", barcode: "", price: "", stock: "" });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  // edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      barcode: product.barcode,
      price: product.price,
      stock: product.stock
    });
    setEditId(product._id);
  };


  // delete product
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
      `http://localhost:5000/api/products/${id}`,
      { headers: {Authorization: `Bearer ${token}`} }
    )
      .then(()=> {
        toast("Product Deleted");
      })

    fetchProducts();
    setPage(1);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
    
  };
  return (
    <div style={{padding: "20px"}}>
      <h2>
        Product Management
      </h2>

      {/* form  */}
      <form onSubmit={handleSubmit}>
        <input 
          name='name'
          placeholder='Product Name'
          value={form.name}
          onChange={handleChange}
          required
        />

        <input 
          name='barcode'
          placeholder='Barcode'
          value={form.barcode}
          onChange={handleChange}
          required
        />

        <input 
          name='price'
          type='number'
          placeholder='price'
          value={form.price}
          onChange={handleChange}
          required
        />

        <input 
          name='stock'
          type='number'
          placeholder='Stock'
          value={form.stock}
          onChange={handleChange}
          required
        />

        <button type='submit' className=" py-2 disabled:opacity-70 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Table  */}
      <div className='bg-white shadow rounded-xl overflow-hidden mt-6'>
        <table className='w-full text-sm text-left'>
        <thead className=' bg-gray-100 text-gray-600 uppercase text-xs'>
          <tr>
            <th className='px-6 py-3'>Product</th>
            <th className='px-6 py-3'>Barcode</th>
            <th className='px-6 py-3'>Price</th>
            <th className='px-6 py-3'>Stock</th>
            <th className='px-6 py-3 text-right'>Actions</th>
          </tr>
        </thead>

        <tbody className='divide-y'>
          {products.map((p) => (
            <tr 
              key={p._id}
              className={`hover:bg-gray-50 ${
                p.lowStockLimit && p.stock <= p.lowStockLimit
                  ? "bg-red-50" 
                  : ""
              }`}
            >
              <td className='px-6 py-4 font-medium text-gray-800'>{p.name}</td>
              <td className='px-6 py-4 text-gray-600'>{p.barcode}</td>
              <td className='px-6 py-4 font-semibold text-indigo-600'>₹{p.price}</td>
              <td className='px-6 py-4'>
              <span className='font-medium'>{p.stock}</span>
                
                {p.stock <= p.lowStockLimit && (
                  <span className='ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded'>
                    ⚠ Low
                  </span>
                )}
              </td>
              <td className='px-6 py-4 text-right'>
                <button 
                  onClick={()=> handleEdit(p)}
                  className='text-blue-600 hover:underline'
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(p._id)}
                  className='ml-4 text-red-600 hover:underline'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      

      {/* pagination Button  */}
      <div className='flex items-center justify-between mt-6'>
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
          className={`px-4 py-2 rounded-lg border
          ${page === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100"
          }
          `}
        >
          Previous
        </button>

        <span className='text-gray-600 font-medium' >
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(prev => prev + 1)}
          className={`px-4 py-2 rounded-lg border
          ${page === pages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100"}
          `}
        >
            Next
          </button>
      </div>
    </div>
  );
}


export default Products
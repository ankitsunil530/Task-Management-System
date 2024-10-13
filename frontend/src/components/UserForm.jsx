import  { useState } from 'react';
import axios from 'axios';
import './UserForm.css';
const UserForm = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sending the form data to the server
    axios.post('http://localhost:5000/add-user', {
      name: name,
      dob: dob,
      address: address,
      phone: phone,
    })
    .then(response => {
      alert('User added successfully');
    })
    .catch(error => {
      alert('Error adding user');
      console.log(error);
    });
  };

  return (
    <div className="bg-slate-900 grid place-content-center h-screen">
       <div className='bg-slate-200 rounded-xl p-4 items-center space-y-4'>
        <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input className="rounded-xl bg-slate-600"type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <br />
      <label>
        Date of Birth:
        <input className="rounded-xl"type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
      </label>
      <br />
      <label>
        Address:
        <textarea className="rounded-xl"value={address} onChange={(e) => setAddress(e.target.value)} required />
      </label>
      <br />
      <label>
        Phone:
        <input className="rounded-xl" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </label>
      <br />
      <button  className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded" type="submit">Add User</button>
    </form>
    </div>
    </div>
    
    
  );
};

export default UserForm;

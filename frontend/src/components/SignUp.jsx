import {useState} from 'react';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  function handleSubmit(){
    alert(`Signing up with Name: ${name}, Email: ${email}`);
  }
  return (
    
       <div className='min-h-screen flex items-center bg-white justify-center'>
           <form
           onSubmit={handleSubmit}
           className='bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 rounded-lg shadow-lg w-full max-w-sm'
           >
            <h2 className="text-3xl font-bold text-center text-white mb-8">Sign Up</h2>
            <label className='block mb-2  text-bold text-white'>Full Name</label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
                placeholder="Enter your name"
                required/>
            <label className='block mb-2 text-bold text-white'>
              Username
            </label>
            <input 
            type='text'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500'
            placeholder='Enter your username'
            required
            />
            <label className='block mb-2 text-bold text-white'>Email</label>
            <input
            className='w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500'
            type='text'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
            />
            <label
            className='block mb-2 text-bold text-white mt-1'
            >Phone</label>
            <input
            type='text'
            className='w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500'
            id='phone'
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            placeholder='Enter your phone number'
            required
            />
            <label
            className='block mb-2 text-bold text-white mt-1'>
              Password
            </label>
            <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500'
            placeholder='Enter your password'
            required
            />
            <button
            type='submit'
            className='w-full mt-4 p-3 bg-blue-500 text-white rounded-lg'
            >SignUp</button>
            <p>If you have already an account, please <a href='/login'
            className='text-white'>Login</a></p>
           </form>
       </div>
   
  )
}

export default SignUp;
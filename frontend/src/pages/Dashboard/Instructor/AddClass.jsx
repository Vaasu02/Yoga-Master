import React, { useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useUser from '../../../hooks/useUser';

const imgkey = import.meta.env.VITE_IMGDB_TOKEN;

const AddClass = () => {
    const APT_KEY = `https://api.imgbb.com/1/upload?key=${imgkey}&name=`
    const axioSecure = useAxiosSecure();
    const { currentUser, isloading } = useUser();
    const [image, setimage] = useState(null);

    const HandleImageChange = (e) => {
        const file = e.target.files[0];
        setimage(file);
    }

    const handleformsubmit = (e) => {
        e.preventDefault();
        const formdata = new FormData(e.target);
        // console.log(formdata);
        const newdta = Object.fromEntries(formdata);
        formdata.append('file', image);
        // console.log(newdta);

        fetch(APT_KEY, {
            method: "POST",
            body: formdata
        }).then(res => res.json()).then(data => {
            console.log(data);
            if (data.success === true) {
                console.log(data.data.display_url);
                newdta.image = data.data.display_url;
                newdta.instructorName = currentUser?.name;
                newdta.instructorEmail = currentUser?.email;
                newdta.status = 'pending';
                newdta.submitted = new Date();
                newdta.totalEnrolled = 0;
                axioSecure.post('/new-class', newdta).then(res => {
                    alert("successfullt added class");
                    console.log(res.data);
                })
            }
        })

    }
    if (isloading) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <div className="my-10">
                <h1 className="text-center text-3xl font-bold">Add Your Course</h1>
            </div>

            <form onSubmit={handleformsubmit} className="mx-auto p-6 bg-white w-full rounded shadow">
                <div className="grid grid-cols-2 w-full gap-3 items-center text-nowrap">
                    <div className="mb-6 ">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Course Name</label>
                        <input type="text" required placeholder='Your Course Name' name='name' id='name' className='w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500' />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="image" className="text-gray-700 font-bold mb-2">Course Thumbnail</label>
                        <input type="file" required name='image' onChange={HandleImageChange} className='block mt-[5px] w-full border border-secondary shadow-sm rounded-md text-sm focus:z-10 focus:bender-blue-500 focus:ring-blue-500 file:border-0  file:bg-secondary  file:text-white file:mr-4 file:py-3 file:px-4  ' />
                    </div>
                </div>

                <div className="">
                    <h1 className="text-[12px] my-2 ml-2 text-secondary">You can not change your name or email</h1>
                    <div className="grid gap-3 grid-cols-2">
                        <div className="mb-6">
                            <label htmlFor="instructorname" className="block text-gray-700 font-bold mb-2">Instructor Name</label>
                            <input value={currentUser?.name} readOnly disabled type="text" className="px-4 py-2 border border-secondary w-full rounded-md focus:outline-none focus:ring-blue-500" name='instructorname' />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="instructoremail" className="block text-gray-700 font-bold mb-2">Instructor Email</label>
                            <input value={currentUser?.email} readOnly disabled type="text" className="px-4 w-full py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500" name='instructoremail' />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 w-full gap-3 items-center">
                    <div className="mb-6">
                        <label htmlFor="avialabelseats" className="block text-gray-700 font-bold mb-2">Avialabel Seats</label>
                        <input required type="number" className="px-4 w-full py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500" name='avialabelseats' placeholder='How many seats?' />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Price</label>
                        <input required type="number" className="px-4 w-full py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500" name='price' placeholder='Enter Your Course Price' />
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="videolink" className="block text-gray-700 font-bold mb-2">Youtube Link</label>
                    <p className="text-[12px] my-2 mt-2 text-secondary">Only youtube video are supported</p>
                    <input required type="text" className="px-4 w-full py-2 border border-secondary rounded-md focus:outline-none focus:ring-blue-500" name='videolink' placeholder='Your course intro Link?' />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description About your course</label>
                    <textarea name="description" rows="4" className=" resize-none border w-full p-2 rounded-lg border-secondary outline-none"></textarea>
                </div>

                <div className="text-center w-full">
                    <button className="bg-secondary w-full hover:bg-red-400 duration-200 text-white font-bold oy-2 px-4 py-3 rounded" type='submit'>Add New Course</button>
                </div>
            </form>
        </div>
    )
}

export default AddClass
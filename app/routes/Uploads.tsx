import React, { useState } from 'react'
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'

const Uploads = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget.closest('form')
            if(!form) return;
            const formData = new FormData(form)

            const companyName = formData.get('company-name');
            const jobTitle = formData.get('job-title');
            const jobDescription = formData.get('job-description');

            console.log(companyName,jobTitle,jobDescription,file)
    }
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover w-full">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your resume</h1>
                    {
                        isProcessing ? (
                            <>
                                <h2>{statusText}</h2>
                                <img src="/images/resume-scan.gif" alt="" className='w-full h-full object-cover' />
                            </>
                        ) : (
                            <h2>Upload your resume</h2>
                        )
                    }
                    {
                        !isProcessing && (
                            <form id="upload-form" className='flex flex-col gap-4' onSubmit={handleSubmit}>
                                <div className='form-div'>
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" id="company-name" name="company-name" placeholder='Enter company name' required />

                                    <label htmlFor="job-title">Job Title</label>
                                    <input type="text" id="job-title" name="job-title" placeholder='Enter job title' required />

                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea id="job-description" name="job-description" placeholder='Enter job description' required />

                                    <div className="form-div"> 
                                        <label htmlFor="uploader"> Upload your resume</label>
                                        <FileUploader onFileSelect={handleFileSelect} />
                                    </div>
                                    <button type='submit' className='primary-btn'>Upload</button>
                                </div> 
                                
                            </form>
                        )
                    }
                </div>
            </section>
        </main>

    ) 
}

export default Uploads

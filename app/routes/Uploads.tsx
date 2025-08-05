import { prepareInstructions } from '../../constants';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';

const Uploads = () => {
    const {auth,isLoading,fs,ai,kv}= usePuterStore()

    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async({companyName,jobTitle,jobDescription,file}:{companyName:String,jobTitle:String,jobDescription:String,file:File})=>{
        setIsProcessing(true);
        setStatusText("Uploading the file ...")

        const uploadedfile = await fs.upload([file])

        if(!uploadedfile) return setStatusText("Error: Failed to upload the file ");

            setStatusText("Converting to image...");
            const imageFile = await convertPdfToImage(file)
            if(!imageFile.file) return setStatusText("Error : Failed to convert the pdf to image")

                setStatusText("Uploading the image...")
                const uploadedImage = await fs.upload([imageFile.file])
                if(!uploadedImage) return setStatusText("Error: Failed to upload the image ");

                setStatusText("Preparing Data ...")

            const uuid = generateUUID();

            const data ={
                id:uuid,
                resumepath:uploadedfile.path,
                imagePath:uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback:"",
            }
            await kv.set(`resume:${uuid}`,JSON.stringify(data));
            setStatusText('Analyzing....');

            const feedback = await ai.feedback(
                uploadedfile.path,
                prepareInstructions({jobDescription,jobTitle})
            )

            if(!feedback) return setStatusText("Error: Failed to analyze resume")

                const feedbacktext = typeof feedback.message.content === 'string'
                ? feedback.message.content
                :feedback.message.content[0].text;

                data.feedback = JSON.parse(feedbacktext)
                await kv.set(`resume:${uuid}`,JSON.stringify(data));
                setStatusText("Analysis complete Redirecting ....")
                console.log(data)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget.closest('form')
            if(!form) return;
            const formData = new FormData(form)

            const companyName = formData.get('company-name') as string;
            const jobTitle = formData.get('job-title') as string;
            const jobDescription = formData.get('job-description') as string;

           if(!file) return;
            console.log(file)
           handleAnalyze({companyName,jobTitle,jobDescription,file})
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

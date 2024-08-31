import React, { useState, useEffect, useContext, useRef } from 'react'
import { API, Storage } from 'aws-amplify'
import Context from '../../../Context/Context'
import InstitutionContext from '../../../Context/InstitutionContext'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Image, Trash2Icon, Upload, X } from 'lucide-react'
import { toast } from 'react-toastify'

import Spinner from '../../../spinner'
import { FadeLoader } from 'react-spinners'
import NavBar from '../../../components/Header'
import Footer from '../../../components/Footer'

import 'react-lazy-load-image-component/src/effects/blur.css'
import './Gallery.css'
import 'react-loading-skeleton/dist/skeleton.css'

const Gallery = () => {
  const [uploading, setUploading] = useState(false)
  const {
    getImagesFromAPI,
    tempImgSrc,
    setTempImgSrc,
    imageUrls,
    setImageUrls,
    title,
    setTitle,
    description,
    setDescription
  } = useContext(Context)

  const [img, setImg] = useState()
  const [model, setModel] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const userData = useContext(Context)
  const user = userData.userData
  const [selectedFile, setSelectedFile] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const bucketName = 'team-dev-testing'
  const region = 'us-east-2'
  const institution = user.institution
  const { institutionData: InstitutionData } = useContext(InstitutionContext)
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteing, setIsDeleteing] = useState(false)
  const [isDataUploading, setIsDataUploading] = useState(false)
  const [selectValve, setSelectValve] = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await getImagesFromAPI()
      setLoading(false)
    }

    console.log('Fetching images...')
    console.log('User data:', user)
    if (user && user.userType === 'admin') {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
    console.log('isAdmin after setting:', isAdmin)
    fetchData()
    // eslint-disable-next-line
  }, [user])

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    console.log('File selected:', file)

    console.log(file)

    if (file.size > 30 * 1024 * 1024) {
      toast.error('Please upload an image/video of less than 30MB size.', {
        className: 'custom-toast'
      })
      return
    }

    const folderPath = `${user.institution}`
    const existingImageNames = imageUrls.map((url) => url.split('/').pop())

    if (existingImageNames.includes(file.name)) {
      toast.error('Selected image/video already exists.', {
        className: 'custom-toast'
      })
      return (fileInputRef.current.value = '')
    }
    setShowInput(true)
    if (imageUrls.length >= 25) {
      toast.error(
        'Maximum limit reached. You can upload up to 25 images/videos.',
        {
          className: 'custom-toast'
        }
      )
      return
    }

    setUploading(true)
    try {
      console.log('Uploading media:', file.name, file.type)
      await Storage.put(`${folderPath}/${file.name}`, file, {
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`)
        },
        contentType: file.type,
        bucket: bucketName,
        region: region,
        ACL: 'public-read'
      })
      console.log('Image uploaded successfully.')

      const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/public/${folderPath}/${file.name}`
      setSelectedFile(imageUrl)
      console.log(title)
      console.log(description)
      console.log('API call successful.')
      await getImagesFromAPI()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading image: ', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false) // Ensure this is called to stop the spinner
    }
  }

  const uploadImageDataToAPI = async () => {
    setIsDataUploading(true)
    const filename = selectedFile.split('/').pop()
    try {
      const data = {
        institution: institution,
        title: title,
        description: description,
        imageUrl: filename,
        imgLink: selectedFile
      }

      await API.post('user', `/admin/upload-image/${institution}`, {
        body: data
      })
      setTitle('')
      setDescription('')
      setSelectedFile('') // Reset the selected file
      setIsDataUploading(false)
      setShowInput(false)
    } catch (error) {
      console.error('Error uploading image data to API: ', error)
    } finally {
      getImagesFromAPI()
      setTempImgSrc('')
    }
  }

  const getImg = (imageUrl) => {
    setTempImgSrc(imageUrl)
    setModel(true)
    setImg(imageUrl)
    getImagesFromAPI(imageUrl)
  }

  const handleDelete = async (tempImgSrc) => {
    console.log('Deleting image:', tempImgSrc)
    try {
      const key = img.split(
        `https://${bucketName}.s3.${region}.amazonaws.com/public/`
      )[1]

      await Storage.remove(key, {
        bucket: bucketName,
        region: region
      })
      setImageUrls((prevUrls) => prevUrls.filter((url) => url !== tempImgSrc))
      setSelectedFile('')
      // Fetch updated image list after deletion
      getImagesFromAPI()
    } catch (error) {
      console.error('Error deleting image: ', error)
    }
    setModel(false)
  }

  const dataDelete = async (tempImgSrc) => {
    console.log(tempImgSrc)
    setIsDeleteing(true)
    try {
      await API.del('user', `/admin/delete-image/${institution}`, {
        body: {
          imageUrl: tempImgSrc
        }
      })
    } catch (error) {
      console.log(error)
    }
    handleDelete(tempImgSrc)
    setIsDeleteing(false)
    setModel(false)
  }

  const handleCancelUpload = () => {
    setShowInput(false)
    setSelectedFile('')
    setTitle('')
    setDescription('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  let mediaUrls = imageUrls
  if (selectValve === 'images') {
    mediaUrls = imageUrls.filter(
      (url) =>
        url.split('/').pop().split('.')[1] !== 'mp4' &&
        url.split('/').pop().split('.')[1] !== 'avi'
    )
  } else if (selectValve === 'videos') {
    mediaUrls = imageUrls.filter(
      (url) =>
        url.split('/').pop().split('.')[1] === 'mp4' ||
        url.split('/').pop().split('.')[1] === 'avi'
    )
  } else {
    mediaUrls = imageUrls
  }

  return (
    <>
      <div className="min-h-screen">
        {!model && <NavBar />}
        <div className={model ? 'model open' : 'model'}>
          {isDeleteing ? (
            <div className="w-[22.5vw] h-[30vh] z-10 flex flex-col justify-center items-center rounded-lg max800:w-[70vw] max800:h-[20vh]">
              <FadeLoader
                color="white"
                speedMultiplier={2}
                height={15}
                width={5}
              />
            </div>
          ) : (
            <>
              {tempImgSrc?.split('/').pop().split('.')[1] === 'mp4' ||
              tempImgSrc?.split('/').pop().split('.')[1] === 'avi' ? (
                <div className="max-h-[90vh] relative">
                  <video
                    className="w-auto max-w-full h-auto max-h-[90vh] block box-border my-0 mx-auto rounded"
                    src={tempImgSrc}
                    autoPlay
                    muted
                    controls
                    loop
                  />
                  {(title || description) && (
                    <div className="absolute bottom-6 left-8 right-8 p-4 bg-zinc-800 bg-opacity-50 text-white w-auto min-w-[20rem] min-h-[20vh] max-w-[30rem] rounded-lg max800:w-[90vw] max800:fixed max800:bottom-4 max800:text-[.7rem]">
                      <h2 className="text-xl font-semibold roboto-slab-regural">
                        {title}
                      </h2>
                      <p className="roboto-slab-normal">{description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-h-[90vh] relative">
                  <img
                    className="w-auto max-w-[80vw] h-auto max-h-[90vh] block box-border my-0 mx-auto rounded"
                    src={tempImgSrc}
                    alt="fitness"
                  />
                  {(title || description) && (
                    <div className="absolute bottom-6 left-8 right-8 p-4 bg-zinc-800 bg-opacity-50 text-white w-auto max-w-[30rem] rounded-lg max800:w-[90vw] max800:fixed max800:bottom-4 max800:text-[.7rem]">
                      <h2 className="text-xl font-semibold roboto-slab-regural">
                        {title}
                      </h2>
                      <p className="roboto-slab-normal">{description}</p>
                    </div>
                  )}
                </div>
              )}
              <div className="fixed top-[20px] right-[20px] flex flex-row justify-center items-center gap-3 text-white cursor-pointer">
                {isAdmin && (
                  <Trash2Icon
                    height={24}
                    width={24}
                    onClick={() => dataDelete(tempImgSrc)}
                  />
                )}
                <X
                  height={24}
                  width={24}
                  onClick={() => {
                    setModel(false)
                    setTitle('')
                    setDescription('')
                    setTempImgSrc('')
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div className={showInput ? 'showInput open' : 'showInput'}>
          {isDataUploading ? (
            <div className="w-[22.5vw] h-[30vh] z-10 flex flex-col justify-center items-center rounded-lg max800:w-[70vw] max800:h-[20vh]">
              <FadeLoader
                color="white"
                speedMultiplier={2}
                height={15}
                width={5}
              />
            </div>
          ) : (
            <>
              <div className="h-auto w-[40vw] bg-white px-5 py-4 rounded-md flex flex-col justify-center items-center gap-4 max800:w-[90vw]">
                <div className="h-[30vh] max800:h-[20vh]">
                  {selectedFile ? (
                    selectedFile?.split('/').pop().split('.')[1] === 'mp4' ||
                    selectedFile?.split('/').pop().split('.')[1] === 'avi' ? (
                      <video
                        className="w-[22.5vw] h-[30vh] rounded"
                        src={selectedFile}
                        autoPlay
                        muted
                      />
                    ) : (
                      <img
                        className="w-[22.5vw] h-[30vh] rounded object-cover"
                        style={{
                          border: `2px solid ${InstitutionData.PrimaryColor}`
                        }}
                        src={selectedFile}
                        alt="fitness"
                      />
                    )
                  ) : uploading ? (
                    <div
                      className="w-[22.5vw] h-[30vh] z-10 flex flex-col justify-center items-center bg-[#ffffff6e] rounded-lg max800:w-[70vw] max800:h-[20vh]"
                      style={{
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)'
                      }}
                    >
                      <Spinner />
                    </div>
                  ) : (
                    <label
                      className="upload border-2 border-dotted border-stone-500 rounded-lg cursor-pointer flex text-black text-[1.2rem] font-semibold flex-col justify-center items-center w-[22.5vw] h-[30vh] mb-1 mt-1  max800:w-[70vw] max800:h-[20vh]"
                      style={{
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)'
                      }}
                    >
                      <Upload height={20} width={20} />
                      Upload
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
                <div className="w-full">
                  <div className="mb-4">
                    <label
                      for="title"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      placeholder="Enter the title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <label
                      for="description"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Enter the description"
                      value={description}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="min800:w-full flex justify-between max800:justify-between max950:gap-2 ">
                  <button
                    className="px-12 py-2 text-white bg-red-400 rounded flex flex-row gap-2 items-center justify-center"
                    onClick={() => {
                      handleCancelUpload()
                      setUploading(false)
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-12 py-2 text-white rounded flex flex-row gap-2 items-center justify-center"
                    style={{
                      backgroundColor: `${InstitutionData.PrimaryColor}`
                    }}
                    onClick={() => {
                      setShowInput(false)
                      uploadImageDataToAPI(selectedFile)
                    }}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          <div className="py-[2rem] flex justify-center mb-0 text-[3rem] max600:text-[2rem]">
            <h2
              className="text-[3rem] max600:text-[2rem] font-bold text-center w-[15rem] text-white rounded-lg px-4 py-2 galindo-regular"
              style={{ backgroundColor: InstitutionData.PrimaryColor }}
            >
              Gallery
            </h2>
          </div>
          <div>
            <div className="flex justify-end items-center gap-3 mr-8 mb-4">
              <select
                className="px-[1.3rem] py-2 border-2 rounded cursor-pointer"
                value={selectValve}
                onChange={(e) => setSelectValve(e.target.value)}
              >
                <option value="All">All</option>
                <option value="images">Images</option>
                <option value="videos">Videos</option>
              </select>
              {isAdmin && (
                <button
                  className="px-12 py-2 text-white rounded flex flex-row gap-2 items-center justify-center"
                  style={{ backgroundColor: `${InstitutionData.PrimaryColor}` }}
                  onClick={() => {
                    setShowInput(true)
                  }}
                >
                  <Upload height={20} width={20} />
                  Upload
                </button>
              )}
            </div>
          </div>

          {mediaUrls.length === 0 ? (
            <h2 className="text-center text-[1.5rem] mt-16 text-slate-400">
              No Media Found
            </h2>
          ) : (
            <div className="gallery mb-4 columns-4 max850:columns-2">
              {mediaUrls.map((imageUrl, index) =>
                loading ? (
                  <SkeletonTheme baseColor="#bcbcbc" highlightColor="#a6a6a6">
                    <div className="relative flex justify-center items-center">
                      <Skeleton
                        height="40vh"
                        width="24vw"
                        className="mb-[12px] max900:!w-[45vw] max900:!h-[20vh]"
                      />
                      <Image
                        className="absolute w-10 top-[45%] opacity-50"
                        height={48}
                        width={48}
                      />
                    </div>
                  </SkeletonTheme>
                ) : (
                  <div className="media">
                    {imageUrl.split('/').pop().split('.')[1] === 'mp4' ||
                    imageUrl.split('/').pop().split('.')[1] === 'avi' ? (
                      <video
                        key={index}
                        src={imageUrl}
                        alt="Gallery"
                        style={{
                          width: '100%'
                        }}
                        onClick={() => getImg(imageUrl)}
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <img
                        key={index}
                        src={imageUrl}
                        alt="Gallery"
                        style={{
                          width: '100%'
                        }}
                        onClick={() => getImg(imageUrl)}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Gallery

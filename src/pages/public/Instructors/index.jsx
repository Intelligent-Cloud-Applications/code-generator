import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import NavBar from "../../../components/Header";
import Footer from "../../../components/Footer";
import { API } from 'aws-amplify';
import Context from '../../../Context/Context';
import InstitutionContext from '../../../Context/InstitutionContext';
import './Instructor.css';

const Instructor = () => {
  const [instructorList, setInstructorList] = useState([]);
  const UtilCtx = useContext(Context).util;
  const [loaderInitialized, setLoaderInitialized] = useState(false);
  const { institutionData } = useContext(InstitutionContext);

  useEffect(() => {
    const fetchInstructorList = async () => {
      try {
        if (!loaderInitialized) {
          UtilCtx.setLoader(true);
          setLoaderInitialized(true);
        }
        const response = await API.get('main', `/any/instructor-list/${institutionData.InstitutionId}`);
        const filteredInstructors = response.filter(instructor => instructor.instructorId !== 'id-for-canceled-class');
        const sortedInstructors = filteredInstructors.sort((a, b) => {
          if (a.position === 'Master Instructor' && b.position !== 'Master Instructor') return -1;
          if (a.position !== 'Master Instructor' && b.position === 'Master Instructor') return 1;
          return 0;
        });
        localStorage.setItem(`instructorList_${institutionData.InstitutionId}`, JSON.stringify({
          data: sortedInstructors,
          timestamp: Date.now()
        }));
        setInstructorList(sortedInstructors);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        UtilCtx.setLoader(false);
      }
    };

    const cachedInstructorList = localStorage.getItem(`instructorList_${institutionData.InstitutionId}`);
    if (cachedInstructorList) {
      const { data, timestamp } = JSON.parse(cachedInstructorList);
      if (Date.now() - timestamp < 60 * 60 * 1000) { 
        setInstructorList(data);
      } else {
        fetchInstructorList();
      }
    } else {
      fetchInstructorList();
    }
  }, [UtilCtx, loaderInitialized, institutionData.InstitutionId]);

  return (
    <div>
      <NavBar />
      <div
        className={`flex flex-col items-center background-container mt-[1.5rem]`}
        style={{
          backgroundImage: `url(${institutionData.InstructorBg})`,
        }}
      >
        <div
          className={`grid grid-cols-1 gap-6 justify-center ${instructorList.length >= 3 ? "md:grid-cols-3" : instructorList.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1"} bg`}
        >
          {instructorList.map((instructor, i) => (
            <div className={`inst-card`} key={i}>
              <Card
                className={`Box`}
                style={{
                  backgroundImage: `url(${instructor.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '29rem',
                  borderRadius: '10px'
                }}
              >
                <div className={`overlay`}></div>
                <div
                  className={`instructor-card-text flex flex-col items-center`}
                >
                  <h4 className={`text-[1.3rem] font-semibold`}>
                    {instructor.name}
                  </h4>
                  <h6>{instructor.position}</h6>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Instructor;

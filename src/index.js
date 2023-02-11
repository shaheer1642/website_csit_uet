import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginLayout from "./layouts/LoginLayout";
import MainHome from "./views/MainHome";
import Login from "./views/Login/Login";
import About from "./views/About";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";
import MisLayout from "./layouts/MisLayout";
import MisHome from "./views/MIS/Home/MisHome";
import MisEvents from "./views/MIS/Events/MisEvents";
import MisBatches from "./views/MIS/Registration/Batches/MisBatches";
import MisEventsCreate from "./views/MIS/Events/MisEventsCreate";
import MisEventsUpdate from "./views/MIS/Events/MisEventsUpdate";
import React from "react";
import MisBatchesCreate from "./views/MIS/Registration/Batches/MisBatchesCreate";
import MisBatchesUpdate from "./views/MIS/Registration/Batches/MisBatchesUpdate";
import MisTeachers from "./views/MIS/Teachers/MisTeachers";
import MisTeachersCreate from "./views/MIS/Teachers/MisTeachersCreate";
import MisTeachersUpdate from "./views/MIS/Teachers/MisTeachersUpdate";
import MisCourses from "./views/MIS/Courses/MisCourses";
import MisCoursesCreate from "./views/MIS/Courses/MisCoursesCreate";
import MisCoursesUpdate from "./views/MIS/Courses/MisCoursesUpdate";
import MisBatchManagement from "./views/MIS/Registration/Batches/MisBatchManagement";
import MisStudentsCreate from "./views/MIS/Registration/Batches/Students/MisStudentsCreate";
import MisStudentsUpdate from "./views/MIS/Registration/Batches/Students/MisStudentsUpdate";
import MisSemestersCreate from "./views/MIS/Registration/Batches/Semesters/MisSemestersCreate";
import MisSemestersUpdate from "./views/MIS/Registration/Batches/Semesters/MisSemestersUpdate";
import MisSemesterCourses from "./views/MIS/Registration/Batches/Semesters/Courses/MisSemesterCourses";
import MisSemestersCoursesCreate from "./views/MIS/Registration/Batches/Semesters/Courses/MisSemestersCoursesCreate";
import MisSemestersCoursesUpdate from "./views/MIS/Registration/Batches/Semesters/Courses/MisSemestersCoursesUpdate";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainHome />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="/login" element={<LoginLayout />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/mis" element={<MisLayout />}>
          <Route index element={<MisHome />} />

          <Route path="events" element={<MisEvents />} />
            <Route path="events/create" element={<MisEventsCreate />} />
            <Route path="events/update" element={<MisEventsUpdate />} />

          <Route path="batches" element={<MisBatches/>}/>
            <Route path="batches/create" element={<MisBatchesCreate/>}/>
            <Route path="batches/update" element={<MisBatchesUpdate/>}/>

          <Route path="batches/batchManagement" element={<MisBatchManagement/>}/>
            <Route path="batches/batchManagement/students/create" element={<MisStudentsCreate/>}/> 
            <Route path="batches/batchManagement/students/update" element={<MisStudentsUpdate/>}/> 
            <Route path="batches/batchManagement/semesters/create" element={<MisSemestersCreate/>}/> 
            <Route path="batches/batchManagement/semesters/update" element={<MisSemestersUpdate/>}/> 
            <Route path="batches/batchManagement/semesters/courses" element={<MisSemesterCourses/>}/> 
            <Route path="batches/batchManagement/semesters/courses/create" element={<MisSemestersCoursesCreate/>}/> 
            <Route path="batches/batchManagement/semesters/courses/update" element={<MisSemestersCoursesUpdate/>}/> 

          <Route path="teachers" element={<MisTeachers/>}/>
            <Route path="teachers/create" element={<MisTeachersCreate/>}/>
            <Route path="teachers/update" element={<MisTeachersUpdate/>}/>

          <Route path="courses" element={<MisCourses/>}/>
            <Route path="courses/create" element={<MisCoursesCreate/>}/>
            <Route path="courses/update" element={<MisCoursesUpdate/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
  </ThemeProvider>
);
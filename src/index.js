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
import MisHome from "./views/MIS/MisHome";
import MisEvents from "./views/MIS/Events/MisEvents";
import MisBatches from "./views/MIS/Registration/MisBatches";
import MisEventsCreate from "./views/MIS/Events/MisEventsCreate";
import MisEventsUpdate from "./views/MIS/Events/MisEventsUpdate";
import React from "react";
import MisBatchesCreate from "./views/MIS/Registration/MisBatchesCreate";
import MisBatchesUpdate from "./views/MIS/Registration/MisBatchesUpdate";
import MisStudent from "./views/MIS/Registration/MisStudents";
import MisStudentsCreate from "./views/MIS/Registration/MisStudentsCreate";
import MisStudentsUpdate from "./views/MIS/Registration/MisStudentsUpdate";
import MisTeachers from "./views/MIS/Registration/MisTeachers";
import MisTeachersCreate from "./views/MIS/Registration/MisTeachersCreate";
import MisTeachersUpdate from "./views/MIS/Registration/MisTeachersUpdate";
import MisCourses from "./views/MIS/Registration/MisCourses";

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
          <Route path="batches/students" element={<MisStudent/>}/>
          <Route path="batches/students/create" element={<MisStudentsCreate/>}/> 
          <Route path="batches/students/update" element={<MisStudentsUpdate/>}/> 
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
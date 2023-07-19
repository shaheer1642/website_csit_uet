import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";
import React from "react";
import MainLayout from "./layouts/MainLayout";
import MisLayout from "./layouts/MisLayout";
import LoginLayout from "./layouts/LoginLayout";
import Login from "./views/Login/Login";
import MisHome from "./views/MIS/Home/MisHome";
import MainHome from "./views/Main/MainHome";
import MainCourses from "./views/Main/MainCourses";
import MainInstructors from "./views/Main/MainInstructors";
import MainDownloads from "./views/Main/MainDownloads";
import MainNewsAndEvents from "./views/Main/MainNewsAndEvents";
import MisEvents from "./views/MIS/Events/MisEvents";
import MisBatches from "./views/MIS/Registration/Batches/MisBatches";
import MisEventsCreate from "./views/MIS/Events/MisEventsCreate";
import MisEventsUpdate from "./views/MIS/Events/MisEventsUpdate";
import MisBatchesCreate from "./views/MIS/Registration/Batches/MisBatchesCreate";
import MisBatchesUpdate from "./views/MIS/Registration/Batches/MisBatchesUpdate";
import MisTeachers from "./views/MIS/Teachers/MisTeachers";
import MisTeachersCreate from "./views/MIS/Teachers/MisTeachersCreate";
import MisTeachersUpdate from "./views/MIS/Teachers/MisTeachersUpdate";
import MisCourses from "./views/MIS/Courses/MisCourses";
import MisCoursesCreate from "./views/MIS/Courses/MisCoursesCreate";
import MisCoursesUpdate from "./views/MIS/Courses/MisCoursesUpdate";
import MisSemesters from "./views/MIS/Semesters/MisSemesters";
import MisSemestersCreate from "./views/MIS/Semesters/MisSemestersCreate";
import MisSemestersUpdate from "./views/MIS/Semesters/MisSemestersUpdate";
import MisSemestersCourses from "./views/MIS/Semesters/Courses/MisSemestersCourses";
import MisSemestersCoursesCreate from "./views/MIS/Semesters/Courses/MisSemestersCoursesCreate";
import MisSemestersCoursesUpdate from "./views/MIS/Semesters/Courses/MisSemestersCoursesUpdate";
import MisCoursesStudents from "./views/MIS/Semesters/Courses/Students/MisCoursesStudents";
import MisCourseGradeManagement from "./views/MIS/Teacher Dashboard/Courses/MisCourseGradeManagement";
import MisTeachersCourses from "./views/MIS/Teacher Dashboard/Courses/MisTeachersCourses";
import MisThesis from "./views/MIS/Thesis/MisThesis";
import MisThesisCreate from "./views/MIS/Thesis/MisThesisCreate";
import MisThesisManagement from "./views/MIS/Thesis/MisThesisManagement";
import MisDocuments from "./views/MIS/Documents/MisDocuments";
import MisApplicationsTemplates from "./views/MIS/Applications/ApplicationsTemplates/MisApplicationsTemplates";
import MisApplicationsTemplatesCreateUpdate from "./views/MIS/Applications/ApplicationsTemplates/MisApplicationsTemplatesCreateUpdate";
import SubmitApplication from "./views/MIS/Applications/SubmitApplication";
import SubmitApplicationDraft from "./views/MIS/Applications/SubmitApplicationDraft";
import ViewApplications from "./views/MIS/Applications/viewApplications";
import ViewApplicationsDetail from "./views/MIS/Applications/viewApplicationsDetail";
import MisCoursesStudentsUpdate from "./views/MIS/Semesters/Courses/Students/MisCoursesStudentsUpdate";
import MisStudentCourseGradeManagement from "./views/MIS/Student Dashboard/Courses/MisStudentCourseGradeManagement";
import MisStudentBatches from "./views/MIS/Student Dashboard/Batches/MisStudentBatches";
import MisStudentSemesters from "./views/MIS/Student Dashboard/Semesters/MisStudentSemesters";
import MisStudentCourses from "./views/MIS/Student Dashboard/Courses/MisStudentCourses";
import FirebaseNotifications from "./firebase/firebase-notifications";
import MisDepartments from "./views/MIS/Departments/MisDepartments";
import MisDepartmentsUpdate from "./views/MIS/Departments/MisDepartmentsUpdate";
import MisHelp from "./views/MIS/Help/MisHelp";
import MisProfile from "./views/MIS/Profile/MisProfile";
import MisStudentTranscript from "./views/MIS/Student Dashboard/Transcript/MisStudentTranscript";
import MisStudentPerformance from "./views/MIS/StudentPerformance/MisStudentPerformance";
import MisThesisGrading from "./views/MIS/Thesis/MisThesisGrading";
import MisTeachersPerformance from "./views/MIS/TeachersPerformance/MisTeachersPerformance";
import MisTeacherPerformance from "./views/MIS/Teacher Dashboard/Performance/MisTeacherPerformance";
import MisBatchStudents from "./views/MIS/Registration/Batches/Students/MisBatchStudents";
import MisBatchStudentsCreate from "./views/MIS/Registration/Batches/Students/MisBatchStudentsCreate";
import MisBatchStudentsUpdate from "./views/MIS/Registration/Batches/Students/MisBatchStudentsUpdate";
import MisStudents from "./views/MIS/Students/MisStudents";
import MisStudentsManagement from "./views/MIS/Students/MisStudentsManagement";
import './localStorage'
import { AuthContext } from "./contexts/AuthContext";


class Router extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  render() {
    return (
      <AuthContext.Provider value={{ user: this.state.user, setUser: (user, callback) => this.setState({ user: user }, () => callback ? callback() : null) }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<MainHome />} />
              <Route path="courses" element={<MainCourses />} />
              <Route path="instructors" element={<MainInstructors />} />
              <Route path="downloads" element={<MainDownloads />} />
              <Route path="newsAndEvents" element={<MainNewsAndEvents />} />
            </Route>
            <Route path="/login" element={<LoginLayout />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/mis" element={<MisLayout />}>
              <Route index element={<MisHome />} />

              <Route path="profile" element={<MisProfile />} />

              <Route path="events" element={<MisEvents />} />
              <Route path="events/create" element={<MisEventsCreate />} />
              <Route path="events/update" element={<MisEventsUpdate />} />

              <Route path="departments" element={<MisDepartments />} />
              <Route path="departments/update" element={<MisDepartmentsUpdate />} />

              <Route path="batches" element={<MisBatches />} />
              <Route path="batches/create" element={<MisBatchesCreate />} />
              <Route path="batches/update" element={<MisBatchesUpdate />} />
              <Route path="batches/students" element={<MisBatchStudents />} />
              <Route path="batches/students/create" element={<MisBatchStudentsCreate />} />
              <Route path="batches/students/update" element={<MisBatchStudentsUpdate />} />

              <Route path="students" element={<MisStudents />} />
              <Route path="students/manage" element={<MisStudentsManagement />} />

              <Route path="semesters" element={<MisSemesters />} />
              <Route path="semesters/create" element={<MisSemestersCreate />} />
              <Route path="semesters/update" element={<MisSemestersUpdate />} />
              <Route path="semesters/courses" element={<MisSemestersCourses />} />
              <Route path="semesters/courses/create" element={<MisSemestersCoursesCreate />} />
              <Route path="semesters/courses/update" element={<MisSemestersCoursesUpdate />} />
              <Route path="semesters/courses/students" element={<MisCoursesStudents />} />
              <Route path="semesters/courses/students/update" element={<MisCoursesStudentsUpdate />} />

              <Route path="teachers" element={<MisTeachers />} />
              <Route path="teachers/create" element={<MisTeachersCreate />} />
              <Route path="teachers/update" element={<MisTeachersUpdate />} />

              <Route path="courses" element={<MisCourses />} />
              <Route path="courses/create" element={<MisCoursesCreate />} />
              <Route path="courses/update" element={<MisCoursesUpdate />} />

              <Route path="thesis" element={<MisThesis />} />
              <Route path="thesis/create" element={<MisThesisCreate />} />
              <Route path="thesis/manage" element={<MisThesisManagement />} />
              <Route path="thesis/grading" element={<MisThesisGrading />} />

              <Route path="documents" element={<MisDocuments />} />

              <Route path="studentPerformance" element={<MisStudentPerformance />} />
              <Route path="teachersPerformance" element={<MisTeachersPerformance />} />

              <Route path="applications/applicationsTemplates" element={<MisApplicationsTemplates />} />
              <Route path="applications/applicationsTemplates/create" element={<MisApplicationsTemplatesCreateUpdate />} />
              <Route path="applications/applicationsTemplates/update" element={<MisApplicationsTemplatesCreateUpdate />} />
              <Route path="applications/submitApplication" element={<SubmitApplication />} />
              <Route path="applications/submitApplication/draft" element={<SubmitApplicationDraft />} />
              <Route path="applications/viewApplications" element={<ViewApplications />} />
              <Route path="applications/viewApplications/detail" element={<ViewApplicationsDetail />} />

              <Route path="tportal/courses" element={<MisTeachersCourses />} />
              <Route path="tportal/courses/grading" element={<MisCourseGradeManagement />} />

              <Route path="tportal/performance" element={<MisTeacherPerformance />} />

              <Route path="sportal/batches" element={<MisStudentBatches />} />

              <Route path="sportal/semesters" element={<MisStudentSemesters />} />

              <Route path="sportal/courses" element={<MisStudentCourses />} />
              <Route path="sportal/courses/grading" element={<MisStudentCourseGradeManagement />} />

              <Route path="sportal/transcript" element={<MisStudentTranscript />} />

              <Route path="help" element={<MisHelp />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    )
  }
}
// export default function Router() {
//   return (
//     <AuthContext.Provider value={{ user: this.state.user, setUser: (user, callback) => this.setState({ user: user }, () => callback ? callback() : null) }}>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<MainLayout />}>
//             <Route index element={<MainHome />} />
//             <Route path="courses" element={<MainCourses />} />
//             <Route path="instructors" element={<MainInstructors />} />
//             <Route path="downloads" element={<MainDownloads />} />
//             <Route path="newsAndEvents" element={<MainNewsAndEvents />} />
//           </Route>
//           <Route path="/login" element={<LoginLayout />}>
//             <Route index element={<Login />} />
//           </Route>
//           <Route path="/mis" element={<MisLayout />}>
//             <Route index element={<MisHome />} />

//             <Route path="profile" element={<MisProfile />} />

//             <Route path="events" element={<MisEvents />} />
//             <Route path="events/create" element={<MisEventsCreate />} />
//             <Route path="events/update" element={<MisEventsUpdate />} />

//             <Route path="departments" element={<MisDepartments />} />
//             <Route path="departments/update" element={<MisDepartmentsUpdate />} />

//             <Route path="batches" element={<MisBatches />} />
//             <Route path="batches/create" element={<MisBatchesCreate />} />
//             <Route path="batches/update" element={<MisBatchesUpdate />} />
//             <Route path="batches/students" element={<MisBatchStudents />} />
//             <Route path="batches/students/create" element={<MisBatchStudentsCreate />} />
//             <Route path="batches/students/update" element={<MisBatchStudentsUpdate />} />

//             <Route path="students" element={<MisStudents />} />
//             <Route path="students/manage" element={<MisStudentsManagement />} />

//             <Route path="semesters" element={<MisSemesters />} />
//             <Route path="semesters/create" element={<MisSemestersCreate />} />
//             <Route path="semesters/update" element={<MisSemestersUpdate />} />
//             <Route path="semesters/courses" element={<MisSemestersCourses />} />
//             <Route path="semesters/courses/create" element={<MisSemestersCoursesCreate />} />
//             <Route path="semesters/courses/update" element={<MisSemestersCoursesUpdate />} />
//             <Route path="semesters/courses/students" element={<MisCoursesStudents />} />
//             <Route path="semesters/courses/students/update" element={<MisCoursesStudentsUpdate />} />

//             <Route path="teachers" element={<MisTeachers />} />
//             <Route path="teachers/create" element={<MisTeachersCreate />} />
//             <Route path="teachers/update" element={<MisTeachersUpdate />} />

//             <Route path="courses" element={<MisCourses />} />
//             <Route path="courses/create" element={<MisCoursesCreate />} />
//             <Route path="courses/update" element={<MisCoursesUpdate />} />

//             <Route path="thesis" element={<MisThesis />} />
//             <Route path="thesis/create" element={<MisThesisCreate />} />
//             <Route path="thesis/manage" element={<MisThesisManagement />} />
//             <Route path="thesis/grading" element={<MisThesisGrading />} />

//             <Route path="documents" element={<MisDocuments />} />

//             <Route path="studentPerformance" element={<MisStudentPerformance />} />
//             <Route path="teachersPerformance" element={<MisTeachersPerformance />} />

//             <Route path="applications/applicationsTemplates" element={<MisApplicationsTemplates />} />
//             <Route path="applications/applicationsTemplates/create" element={<MisApplicationsTemplatesCreateUpdate />} />
//             <Route path="applications/applicationsTemplates/update" element={<MisApplicationsTemplatesCreateUpdate />} />
//             <Route path="applications/submitApplication" element={<SubmitApplication />} />
//             <Route path="applications/submitApplication/draft" element={<SubmitApplicationDraft />} />
//             <Route path="applications/viewApplications" element={<ViewApplications />} />
//             <Route path="applications/viewApplications/detail" element={<ViewApplicationsDetail />} />

//             <Route path="tportal/courses" element={<MisTeachersCourses />} />
//             <Route path="tportal/courses/grading" element={<MisCourseGradeManagement />} />

//             <Route path="tportal/performance" element={<MisTeacherPerformance />} />

//             <Route path="sportal/batches" element={<MisStudentBatches />} />

//             <Route path="sportal/semesters" element={<MisStudentSemesters />} />

//             <Route path="sportal/courses" element={<MisStudentCourses />} />
//             <Route path="sportal/courses/grading" element={<MisStudentCourseGradeManagement />} />

//             <Route path="sportal/transcript" element={<MisStudentTranscript />} />

//             <Route path="help" element={<MisHelp />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </AuthContext.Provider>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router />
    <FirebaseNotifications />
  </ThemeProvider>
);
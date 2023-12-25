import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';
import { JobContext, EstPreviewContext, idJobToApplyContext, userIdContext } from './Context';
import "./styles/index.css"
import AllRoutes from './allRoutes';

function App() {
  const [job, setJob] = useState('');
  const [estPreview, setEstPreview] = useState(false);
  const [userId, setUserId] = useState('')

  return <>
    <userIdContext.Provider value={{ userId: userId, setUserId: setUserId }}>
      <JobContext.Provider value={{ job: job, setJob: setJob }}>
        <EstPreviewContext.Provider value={{ estPreview: estPreview, setEstPreview: setEstPreview }}>
            <AllRoutes/>
        </EstPreviewContext.Provider>
      </JobContext.Provider >
    </userIdContext.Provider>
  </>
}

export default App;

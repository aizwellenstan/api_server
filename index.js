const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const mysql = require('mysql')
const app = express()

const path = require('path');
const hbs = require('hbs');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

// const middlewares = require('./auth/middlewares');
// const auth = require('./auth');
// const notes = require('./api/notes');

// app.use(volleyball);
app.use(express.json());
// app.use(middlewares.checkTokenSetUser);

const port = 3000

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'nadi',
    password: 'Nadi1234;',
    database: 'ocms_test'
});

conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//////////////////
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));
/////////////////

//apache under /api
app.get('/', (req, res) => {
    res.send('http://127.0.0.1:3000/companyId/projectId/Module/bottombar/attribute+http://127.0.0.1:3000/companyId/projectId/Module/bottombar/device+http://127.0.0.1:3000/companyId/projectId/Module/bottombar/sensor+http://127.0.0.1:3000/companyId/projectId/Module/bottombar/system');
})

app.get('/colddata', (req, res) => {
    fs.readFile('./data/colddata/SensorColdData 2.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    })
})

app.get('/hotdata', (req, res) => {
    fs.readFile('./data/hotdata/SensorHotData.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    })
})

const token = "eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIn0.n9zXFaD564WqPoPyjWH7vC74r6Kwyyk3-SQaF_VqvincofN4L4Lrl6DIcYy7lc-xuuLMr-V8v7DXwFIKHliopFPkwgf5DemB.dc_l0tfyIUjsUJsmhLdqJw.m7ZXXk1Gzw8ny9ov2XIMmCwqiP-VEK27FWpRBRJgvGkB2UiPDnGFT1TkBoEVHkvR-b09grq9_fHAIsuU6hoLDNM0yJiA4ZjdfuByxipOcr3oLfbQiVFO1zxTppVmW0DGCOxY1jRiD3EEx1jFH80PjQHtojIyJ_u3hnvGffkw3yH6GMXkZaztgQzVxr9y3DJb.anzTkQV28vC4wr3aW4qKWE02ohQCcAX2qzBbKIulH1s"

app.post('/login', (req, res) => {
  if(req.header('US')=='Siemens' && req.header('PS')=='Snadi123') {
    fs.readFile('./data/login/AccountInfoData.json', (err, json) => {
      let obj = JSON.parse(json);
      res.json(obj);
    })
  } else {
    res.json("login failed")
  }
})


app.get('/:companyId/:projectId', function(req, res) {
    var data = {
        "company": {
            "companyId": req.params.companyId,
            "projectId": req.params.projectId
        }
    }
    fs.readFile('./data/ProjectInfo.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    });
});

//http://127.0.0.1:3000/companyId/projectId/projectinfo
app.post('/:companyId/:projectId/projectinfo',(req, res) => {
  if(req.header('token')) {
    fs.readFile('./data/projectinfo/ProjectInfo.json', (err, json) => {
      let obj = JSON.parse(json);
      res.json(obj);
    })
  } else {
    res.json("token failed")
  }
})

//http://127.0.0.1:3000/companyId/projectId/mainmodule
app.post('/:companyId/:projectId/mainmodule',(req, res) => {
  if(req.header('token')) {
    fs.readFile('./data/mainmodule/MainModule.json', (err, json) => {
      let obj = JSON.parse(json);
      res.json(obj);
    })
  } else {
    res.json("token failed")
  }
})

//http://127.0.0.1:3000/companyId/projectId/subfunction
app.post('/:companyId/:projectId/subfunction',(req, res) => {
  if(req.header('token')) {
    fs.readFile('./data/subfunction/SubFunction.json', (err, json) => {
      let obj = JSON.parse(json);
      res.json(obj);
    })
  } else {
    res.json("token failed")
  }
})


//--------------------buttombar_module--------------------------
//http://127.0.0.1:3000/companyId/projectId/Module/bottombar/attribute
//http://127.0.0.1:3000/companyId/projectId/Module/bottombar/device
//http://127.0.0.1:3000/companyId/projectId/Module/bottombar/sensor
//http://127.0.0.1:3000/companyId/projectId/Module/bottombar/system
app.get('/:companyId/:projectId/Module/bottombar/:module',(req, res) => {
  let barmodule = req.params.module
  let sql = "SELECT * FROM bottombar_" + barmodule
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.json(results)
  });
});

app.post('/:companyId/:projectId/Module/bottombar/attribute/update',(req, res) => {
  let sql = 
  "UPDATE bottombar_attribute SET TypeName='" +
  req.body.TypeName + 
  "', TypeIcon='" + 
  req.body.TypeIcon + 
  "', Description='" + 
  req.body.Description + 
  "' WHERE id=" + 
  req.body.id;

  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    // res.redirect(`/${req.params.companyId}/${req.params.projectId}/Module/bottombar/system/web`);
    res.send('success')
  });
});
//-----------------------end-------------------






// app.get('/:companyId/:projectId/Module/bottombar/attribute',(req, res) => {
//   fs.readFile('./data/module/BottomBarAttribute.json', (err, json) => {
//     let obj = JSON.parse(json);
//     res.json(obj);
//   })
// })

app.get('/:companyId/:projectId/Module/bottombar/device',(req, res) => {
  fs.readFile('./data/module/BottomBarDevice.json', (err, json) => {
    let obj = JSON.parse(json);
    res.json(obj);
  })
})

app.get('/:companyId/:projectId/Module/bottombar/sensor',(req, res) => {
  fs.readFile('./data/module/BottomBarSensor.json', (err, json) => {
    let obj = JSON.parse(json);
    res.json(obj);
  })
})

app.get('/:companyId/:projectId/Module/bottombar/system',(req, res) => {
  fs.readFile('./data/module/BottomBarSystem.json', (err, json) => {
    let obj = JSON.parse(json);
    res.json(obj);
  })
})

//--------bottombar_attribute-----------
app.get('/:companyId/:projectId/Module/bottombar/attribute/web',(req, res) => {
  let sql = "SELECT * FROM bottombar_attribute";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('bottombar_attribute_view',{
      results: results
    });
  });
});

app.get('/:companyId/:projectId/Module/bottombar/system/web',(req, res) => {
    let sql = "SELECT * FROM bottombar_system";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.render('product_view',{
        results: results
      });
    });
});

// app.get('/:companyId/:projectId/Module/bottombar/system',(req, res) => {
//     let sql = "SELECT * FROM bottombar_system";
//     let query = conn.query(sql, (err, results) => {
//       if(err) throw err;
//       res.json(results)
//     });
//   });
  
  //route for insert data
  app.post('/:companyId/:projectId/Module/bottombar/system/save',(req, res) => {
    let data = {name: req.body.name, value: req.body.value};
    let sql = "INSERT INTO bottombar_system SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect(`/${req.params.companyId}/${req.params.projectId}/Module/bottombar/system/web`);
    });
  });
  
  //route for update data
  app.post('/:companyId/:projectId/Module/bottombar/system/update',(req, res) => {
    let sql = "UPDATE bottombar_system SET name='"+req.body.name+"', value='"+req.body.value+"' WHERE id="+req.body.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect(`/${req.params.companyId}/${req.params.projectId}/Module/bottombar/system/web`);
    });
  });
  
  //route for delete data
  app.post('/:companyId/:projectId/Module/bottombar/system/delete',(req, res) => {
    let sql = "DELETE FROM bottombar_system WHERE id="+req.body.id+"";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect(`/${req.params.companyId}/${req.params.projectId}/Module/bottombar/system/web`);
    });
  });

// app.use('/auth', auth);
// app.use('/api/v1/notes', middlewares.isLoggedIn, notes);

// function notFound(req, res, next) {
//     res.status(404);
//     const error = new Error('Not Found - ' + req.originalUrl);
//     next(error);
//   }
  
//   function errorHandler(err, req, res, next) {
//     res.status(res.statusCode || 500);
//     res.json({
//       message: err.message,
//       stack: err.stack
//     });
//   }
  
//   app.use(notFound);
//   app.use(errorHandler);

// app.post('/todb', (req, res) => {
    
// })

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

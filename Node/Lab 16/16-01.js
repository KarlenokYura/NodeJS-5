
var http = require("http");
const graphqlTools = require('graphql-tools');
const oracledb = require("oracledb");

const {graphql} = require("graphql");

var dbconfig = {
    user: "KYA",
    password: "Pa$$w0rd",
    connectString: "localhost/orcl",
    privilege: oracledb.SYSDBA
};

const typeDefs = `
type Faculty {
  faculty: String!,
  faculty_name: String!
}
type Teacher {
  teacher: String!,
  teacher_name: String!
}
type Subject {
    subject: String!,
    subject_name: String!,
    pulpit: String!,
    pulpit_name: String!
  }
type Query {
  faculties: [Faculty],
  faculty(faculty: String): Faculty,
  getTeachersByFaculty(faculty: String): [Teacher]!,
  getSubjectsByFaculty(faculty: String): [Subject]!
}
input FacultyEntry {
  faculty: String!,
  faculty_name: String!
}
type Mutation {
  setFaculty(input: FacultyEntry): Faculty!,
  delFaculty(faculty: String): Faculty!,
}`;

async function getAllFaculties() {
    let sql = 'SELECT * FROM faculty';
    let conn = await oracledb.getConnection(dbconfig);
    let result = await conn.execute(sql);
    await conn.close();
    let j = [];
    for (let r of result.rows)  {
        var object = {faculty: r[0], faculty_name: r[1]};
        j.push(object);
    }
    return j;
}

async function getOneFaculty(faculty) {
    let sql = 'SELECT * FROM faculty WHERE faculty.faculty = :faculty';
    let binds = [faculty];
    let conn = await oracledb.getConnection(dbconfig);
    let result = await conn.execute(sql, binds);
    await conn.close();
    var object = {faculty: result.rows[0][0], faculty_name: result.rows[0][1]};
    return object;
}

async function setOneFaculty(input) {
    let sql = 'SELECT * FROM faculty WHERE faculty.faculty = :faculty';
    let binds = [input.faculty];
    let conn = await oracledb.getConnection(dbconfig);
    let result = await conn.execute(sql, binds);
    if (result.rows.length == 0) {
        sql = 'INSERT INTO faculty(faculty, faculty_name) VALUES(:1, :2)';
        binds = [input.faculty, input.faculty_name];
        result = await conn.execute(sql, binds, {autoCommit: true});
    }
    else {
        sql = 'UPDATE faculty SET faculty_name = :1 WHERE faculty = :2';
        binds = [input.faculty_name, input.faculty];
        result = await conn.execute(sql, binds, {autoCommit: true});
    }
    await conn.close();
    return input;
}

async function deleteOneFaculty(faculty) {
    let sql = 'SELECT * FROM faculty WHERE faculty.faculty = :faculty';
    let binds = [faculty];
    let conn = await oracledb.getConnection(dbconfig);
    let result = await conn.execute(sql, binds);
    if (result.rows.length == 0) {
        await conn.close();
        return {faculty: false, faculty_name: false}
    }
    else {
        sql = 'DELETE FROM faculty WHERE faculty = :1';
        binds = [faculty];
        result = await conn.execute(sql, binds, {autoCommit: true});
        await conn.close();
        return {faculty: true, faculty_name: true}
    }
}

async function getAllTeachersByFaculty(faculty) {
    let sql = 'SELECT * FROM teacher LEFT JOIN pulpit ON teacher.pulpit = pulpit.pulpit LEFT JOIN faculty ON pulpit.faculty = faculty.faculty WHERE faculty.faculty = :faculty';
    let binds = [faculty];
    let conn = await oracledb.getConnection(dbconfig);
    let result = await conn.execute(sql, binds);
    await conn.close();
    let j = [];
    for (let r of result.rows)  {
        var object = {teacher: r[0], teacher_name: r[1]};
        j.push(object);
    }
    return j;
}

async function getAllSubjectsByFaculty(faculty) {
    let sql = 'SELECT subject.subject, subject.subject_name, pulpit.pulpit, pulpit.pulpit_name FROM pulpit LEFT JOIN subject ON pulpit.pulpit = subject.pulpit WHERE pulpit.faculty = :faculty';
    let binds = [faculty];
    let conn = await oracledb.getConnection(dbconfig);
    let result = await conn.execute(sql, binds);
    await conn.close();
    let j = [];
    for (let r of result.rows)  {
        var object = {subject: r[0], subject_name: r[1], pulpit: r[2], pulpit_name: r[3]};
        j.push(object);
    }
    return j;
}

const resolvers = {
  Query: {
    faculties(root, args, context, info) {
      return getAllFaculties();
    },
    faculty(root, {faculty}, context, info) {
      return getOneFaculty(faculty);
    },
    getTeachersByFaculty(root, {faculty}, context, info) {
        return getAllTeachersByFaculty(faculty);
    },
    getSubjectsByFaculty(root, {faculty}, context, info) {
        return getAllSubjectsByFaculty(faculty);
    }
  },
  Mutation: {
    setFaculty(root, {input}, context, info) {
      return setOneFaculty(input);
    },
    delFaculty(root, {faculty}, context, info) {
      return deleteOneFaculty(faculty);
    }
  }
};

const schema = graphqlTools.makeExecutableSchema({typeDefs, resolvers});

var test = `query getFaculty{
    faculty(faculty: "ТТЛП      ") {
      faculty
      faculty_name
    }
  }
  
  query getFaculties{
    faculties {
      faculty
      faculty_name
    }
  }
  
  mutation setFaculty {
    setFaculty (input: {faculty: "Testtest", faculty_name: "Bla"}) {
      faculty
      faculty_name
    }
  }
  
  mutation delFaculty {
    delFaculty (faculty: "fff") {
      faculty
      faculty_name
    }
  }
  
  query getTeachersByFaculty{
    getTeachersByFaculty (faculty: "ХТиТ      ") {
      teacher
      teacher_name
    }
  }
  
  query getSubjectsByFaculty{
    getSubjectsByFaculty (faculty: "ХТиТ      ") {
      subject
      subject_name
      pulpit
      pulpit_name
    }
  }`

http.createServer(function (req, res) {
    var query = {};
    req.on("data", (chunk) => {
        query += chunk.toString();
    })
    req.on("end", () => {
        query = query.toString().substr(15, query.length - 15);
        try {
            graphql(schema, query)
            .catch((err) => { console.log(err) })
            .then((result) => {
                res.end(JSON.stringify(result));
            })
        }
        catch (err) {
            res.end(JSON.stringify({error: "Bad json"}))
        }
    })
}).listen(3000)

console.log("Server starts on localhost:3000");
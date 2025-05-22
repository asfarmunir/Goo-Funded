export const getFundedEmailTemplate = (name: string, accountNumber: string) => {
  const FUNDED_TITLE = "Your account is now Funded!";
  const FUNDED_TEMPLATE = `<p>Congratulations <strong>${name}!</strong>,</p><p>Your account #${accountNumber} has been <strong>Funded</strong>`;
  return {
    title: FUNDED_TITLE,
    template: FUNDED_TEMPLATE,
  };
};

export const getBreachedEmailTemplate = (
  name: string,
  accountNumber: string
) => {
  const BREACHED_TITLE = "Your account has been Breached!";
  const BREACHED_TEMPLATE = `
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
    
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
      <!--<![endif]-->

    
    
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
.mj-column-per-75 { width:75% !important; max-width: 75%; }
.mj-column-per-20 { width:20% !important; max-width: 20%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
.moz-text-html .mj-column-per-75 { width:75% !important; max-width: 75%; }
.moz-text-html .mj-column-per-20 { width:20% !important; max-width: 20%; }
    </style>
    
  
    <style type="text/css">
    
    

    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile { width: 100% !important; }
      td.mj-full-width-mobile { width: auto !important; }
    }
  
    </style>
    <style type="text/css">
    *{
      padding:0px;
      margin:0px auto;
      font-family: 'Poppins';
      }
      
      body(
      background-color: #FFFFFF;
      )
      
      .green-border{
     
    
 			background-color: #050614;
      background-position: center;
      background-repeat: no-repeat;
      padding:5px;
      background-size: contain;
      
      }
      
      .borded-collomn{
      margin:3px;
      }
      
      .footer-icons{
      
      width:250px;
      }
      
      .footer-background{
   
      padding:0px 10px;
      }
      
      .footer-boarder{
    
      border:1px solid #2160EB;
      border-radius: 15px;
      padding-bottom:10px;
      
      background-image: url('https://res.cloudinary.com/unionwealthmanagement/image/upload/v1731607723/Vantage/Html%20Email%20Images/footer_bg_2_gtk0ic.png');
      background-size: contain;
      background-repeat: no-repeat;
    
      background-position: right top;
      }
      @media (min-width:440px)  { 
      // phone display
       
      
      }
      
	
      
      
      @media (max-width:441px)  { 
      //desktop size
   
      
      }
    </style>
    
  </head>
  <body style="word-spacing:normal;background-color:#ffffff;">
    
    
      <div
         style="background-color:#ffffff;"
      >
        
      
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0, -0.5" position="0, -0.5" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1731614715/Vantage/Html%20Email%20Images/hero%20image/Breach_Detected_lihus5.png" type="frame" size="1,1" aspect="atmost" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]-->
          
      <div  style="background:url('https://res.cloudinary.com/unionwealthmanagement/image/upload/v1747401677/email%20images/GooFunded/Breach_Detected_e89fos.png') center top / contain no-repeat;background-position:center top;background-repeat:no-repeat;background-size:contain;margin:0px auto;max-width:600px;">
        <div  style="line-height:0;font-size:0;">
        <table
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 0;padding-top:40%;text-align:center;"
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
                   align="left" style="font-size:0px;padding:10% 15% 0% 15%;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-style:Poppins;font-weight:300;line-height:1.4;text-align:left;color:#001E45;"
      >Hey ${name},
          </br></br>
      Our system detected a <span style="color:#FF0000;"> breach on your account </span>
  ${accountNumber} as it didn't meet the objectives.
      </br></br>
      unfortunetly this account is suspended.</div>
    
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
      </div>
    
        <!--[if mso | IE]></v:textbox></v:rect></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:5px 20px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:420px;" ><![endif]-->
            
      <div
         class="mj-column-per-75 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#2160EB;border-radius:20px;vertical-align:middle;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-bottom:10px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;font-style:Poppins;font-weight:60;line-height:1.4;text-align:center;color:#ffffff;"
      >A Special Promotion</div>
    
                </td>
              </tr>
            
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 25px;padding-bottom:20px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;font-style:Poppins;font-weight:60;line-height:1.4;text-align:center;color:#ffffff;"
      >retry25 </br>
for 25% off</div>
    
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
                   align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:160px;">
              
       
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
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="footer-background-outlook" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
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
      
      <!--[if mso | IE]></td></tr></table><![endif]-->
    
    
      </div>
    
  </body>
</html>
  
  
  `

 
  return {
    title: BREACHED_TITLE,
    template: BREACHED_TEMPLATE,
  };
};

export const getAccountUnlockedEmailTemplate = () => {
  const title = `Prop Picker Unlocked`;
  const template = `
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
    
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
      <!--<![endif]-->

    
    
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
.mj-column-px-160 { width:160px !important; max-width: 160px; }
.mj-column-per-75 { width:75% !important; max-width: 75%; }
.mj-column-per-20 { width:20% !important; max-width: 20%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
.moz-text-html .mj-column-px-160 { width:160px !important; max-width: 160px; }
.moz-text-html .mj-column-per-75 { width:75% !important; max-width: 75%; }
.moz-text-html .mj-column-per-20 { width:20% !important; max-width: 20%; }
    </style>
    
  
    <style type="text/css">
    
    

    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile { width: 100% !important; }
      td.mj-full-width-mobile { width: auto !important; }
    }
  
    </style>
    <style type="text/css">
    *{
      padding:0px;
      margin:0px auto;
      font-family: 'Poppins';
      }
      
      body(
      background-color: #FFFFFF;
      )
      
      .green-border{
     
    
 			background-color: #050614;
      background-position: center;
      background-repeat: no-repeat;
      padding:5px;
      background-size: contain;
      
      }
      
      .borded-collomn{
      margin:3px;
      }
      
      .footer-icons{
      
      width:250px;
      }
      
      .footer-background{
   
      padding:0px 10px;
      }
      
      .footer-boarder{
    
      border:1px solid #2160EB;
      border-radius: 15px;
      padding-bottom:10px;
      
      background-image: url('https://res.cloudinary.com/unionwealthmanagement/image/upload/v1731607723/Vantage/Html%20Email%20Images/footer_bg_2_gtk0ic.png');
      background-size: contain;
      background-repeat: no-repeat;
    
      background-position: right top;
      }
      @media (min-width:440px)  { 
      // phone display
       
      
      }
      
	
      
      
      @media (max-width:441px)  { 
      //desktop size
   
      
      }
    </style>
    
  </head>
  <body style="word-spacing:normal;background-color:#ffffff;">
    
    
      <div
         style="background-color:#ffffff;"
      >
        
      
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0, -0.5" position="0, -0.5" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1731614720/Vantage/Html%20Email%20Images/hero%20image/Pro_vantage_picker_ctuk7i.png" type="frame" size="1,1" aspect="atmost" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]-->
          
      <div  style="background:url('https://res.cloudinary.com/unionwealthmanagement/image/upload/v1731614720/Vantage/Html%20Email%20Images/hero%20image/Pro_vantage_picker_ctuk7i.png') center top / contain no-repeat;background-position:center top;background-repeat:no-repeat;background-size:contain;margin:0px auto;max-width:600px;">
        <div  style="line-height:0;font-size:0;">
        <table
           align="center" background="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1731614720/Vantage/Html%20Email%20Images/hero%20image/Pro_vantage_picker_ctuk7i.png" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:url('https://res.cloudinary.com/unionwealthmanagement/image/upload/v1731614720/Vantage/Html%20Email%20Images/hero%20image/Pro_vantage_picker_ctuk7i.png') center top / contain no-repeat;background-position:center top;background-repeat:no-repeat;background-size:contain;width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 0;padding-top:50%;text-align:center;"
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
                   align="left" style="font-size:0px;padding:20px 30px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:18px;font-weight:500;line-height:1.6;text-align:left;color:#001E45;"
      >Your account is currently in review and you will receive information on how to sign the contract 
and KYC process shortly. </br><span style="color:#2160EB;">This shouldn't take more than 2 business days.</span></div>
    
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
      </div>
    
        <!--[if mso | IE]></v:textbox></v:rect></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#FFFFFF" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;background-color:#FFFFFF;width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:0px 10px 10px 3px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="borded-collomn-outlook" style="vertical-align:middle;width:160px;" ><![endif]-->
            
      <div
         class="mj-column-px-160 mj-outlook-group-fix borded-collomn" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border:2px dashed #001E45;;border-radius:20px;vertical-align:middle;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 20px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-style:Poppins;font-weight:700;line-height:1.4;text-align:center;text-transform:uppercase;color:#001E45;"
      >Your <span style="color:#2160EB"> Skills</span> Our Risk</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td><td class="borded-collomn-outlook" style="vertical-align:middle;width:160px;" ><![endif]-->
            
      <div
         class="mj-column-px-160 mj-outlook-group-fix borded-collomn" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:rgba(225,255,255,0.1);border:2px dashed #001E45;;border-radius:20px;vertical-align:middle;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 20px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-style:Poppins;font-weight:700;line-height:1.4;text-align:center;text-transform:uppercase;color:#001E45;"
      ><span style="color:#2160EB"> Fast</span> & Secure Payouts</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td><td class="borded-collomn-outlook" style="vertical-align:middle;width:160px;" ><![endif]-->
            
      <div
         class="mj-column-px-160 mj-outlook-group-fix borded-collomn" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:rgba(225,255,255,0.1);border:2px dashed #001E45;;border-radius:20px;vertical-align:middle;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 20px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-style:Poppins;font-weight:700;line-height:1.4;text-align:center;text-transform:uppercase;color:#001E45;"
      ><span style="color:#2160EB"> 24</span> /7 live support</div>
    
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
                 style="direction:ltr;font-size:0px;padding:5px 20px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:420px;" ><![endif]-->
            
   
    
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
                 style="direction:ltr;font-size:0px;padding:0px 10px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:580px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 25px;padding-top:40px;padding-bottom:0px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;font-style:Poppins;font-weight:400;line-height:1.4;text-align:center;color:#001E45;"
      >To monitor your<span style="color:#2160EB"> picks</span> please log into your dashboard.</div>
    
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
                   align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:160px;">
              
        <a
           href="#" target="_blank"
        >
          
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1731602943/Vantage/Html%20Email%20Images/Login_Btn_kljnsh.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="160"
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
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="footer-background-outlook" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
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
      
      <!--[if mso | IE]></td></tr></table><![endif]-->
    
    
      </div>
    
  </body>
</html>
  `;

  return {
    title,
    template,
  };
};

export const getPayoutAcceptedEmailTemplate = (name: string) => {
    const PAYOUT_ACCEPTED_TITLE = "Payout Accepted";
    const PAYOUT_ACCEPTED_TEMPLATE = `<p>Hello <strong>${name}</strong>,</p><p>Your payout request has been accepted and will be processed shortly.</p>`;
    return {
        title: PAYOUT_ACCEPTED_TITLE,
        template: PAYOUT_ACCEPTED_TEMPLATE,
    };
}

export const getPayoutRejectedEmailTemplate = (name: string) => {
    const PAYOUT_REJECTED_TITLE = "Payout Rejected";
    const PAYOUT_REJECTED_TEMPLATE = `<p>Hello <strong>${name}</strong>,</p><p>Your payout request has been rejected. Please contact support for more information.</p>`;
    return {
        title: PAYOUT_REJECTED_TITLE,
        template: PAYOUT_REJECTED_TEMPLATE,
    };
}

export const getPayoutSubmittedEmailTemplate = (name: string) => {
    const PAYOUT_SUBMITTED_TITLE = "Payout Submitted";
    const PAYOUT_SUBMITTED_TEMPLATE = (`
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
.mj-column-per-50 { width:50% !important; max-width: 50%; }
.mj-column-px-350 { width:350px !important; max-width: 350px; }
.mj-column-per-20 { width:20% !important; max-width: 20%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
.moz-text-html .mj-column-per-50 { width:50% !important; max-width: 50%; }
.moz-text-html .mj-column-px-350 { width:350px !important; max-width: 350px; }
.moz-text-html .mj-column-per-20 { width:20% !important; max-width: 20%; }
    </style>
    
  
    <style type="text/css">
    
    

    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile { width: 100% !important; }
      td.mj-full-width-mobile { width: auto !important; }
    }
  
    </style>
    <style type="text/css">
    .background-text-header div {
      	background: rgba(255, 255, 255, 0.2) !important;
      	 border: 2px solid #050614;
  	     border-radius: 5px!important;
     		padding:10px !important;
      }
      .rounded-border{
      		background: rgba(0, 255, 0, 0.08) !important;
      	 border: 2px solid #53FC18;
  	     border-radius: 5px;
      
      }
 
      
      .heder-media-q{
				background-size="contain" !important;
     }
      
      .sub-title-box{
      
      background: rgba(25, 25, 255, 0.2) !important;
      
      }
      .sub-title{
      
      font-size:12px !important;
      
      width:230px;
  	  border-radius: 5px !important;
      }
      
      div.footer-icon{
      align:center;
      padding=0px 100px !important;
       width:300px;!important;
      }
      
   
      
      .gaped-boder-box {
  	
      border: 2px solid #53FC18;
  	  border-radius: 5px !important;
      width:200px !important;
      height:200px !important;
      padding:10px !important;
      }
      .green-border{
      /*border: 3px solid #050614;
  	  border-radius: 30px !important;
      height:200px !important;*/
      
      background-image:    url("https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729372393/email%20images/background_with_boarder_cchv4y.png");
 			background-color: #050614;
      background-position: center;
      background-repeat: no-repeat;
      padding:5px;
      background-size: contain;
      
      }
      
      .footer-background{
      url("https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729518924/email%20images/y4dxmcfl3y84tkelv49t.png");
 			background-color: #050614;
      background-position: center;
      background-repeat: no-repeat;
      padding:5px;
      background-size: cover;
      
      }
      
      
      .img-container{
      height:250px !important;
 			background-color: #050614;
      background-repeat: no-repeat;
      padding= 10px;
      background-size: contain;
      }
      .toptitlewithbg{
      background-color: rgba(255, 255, 255, 0.2);
      }
      
      .phase1img{
      background-image:    url("https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729413297/email%20images/Passed%20phase%201/esnkkyheuztg1mm7q6m6.png");
      }
      .phase2img{
      background-image:    url("https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729422926/email%20images/phase%202/wususiu91gwfdfhn3kro.png");
      }
    
      
@media (min-width:440px)  { 
      // phone display
      
         .congrat-title{
      	font-size:8px !important;
      }
      
        .img-container{
          padding-top:50px !important;
        }
        .sub-title{
      
         font-size:12px !important;
         background: rgba(255, 255, 255, 0.2) !important;
         width:250px !important;
  	     border-radius: 5px !important;
        }
      
      	.congrat-title span{
      	  font-size:18px !important;
          padding:10px;
          border-radius: 5px;
      		
        }
        .credit-text{
      	  padding-top:50px;
        }
      .title-text-size{
          font-size:18px !important;
        }
      
    	 .wecome-live-img2{
      		display:none;
        }
      .wecome-live-img1{
      		display:inline;
        }
      .image-fullwidth{
      	padding:5px 0px;
      }
      .login-btn-resize{
       width: 150px;
      }
      
      
    }
      
	
      
      
@media (max-width:441px)  { 
      //desktop size
      .congrat-title{
      	font-size:18px !important;
      }
         
       .congrat-title span{
      	  font-size:12px !important;
      		padding:10px;
          border-radius: 5px;
        }
      
       .img-container{
          //padding-top:50px !important;
      		font-size:12px !important;
        }
      
        .wecome-live-img1{
      		display:none;
        }
      	.wecome-live-img2{
      		display:inline;
        }
      
       .image-fullwidth{
      	padding:20px 0px;
      	}
      
      
      }
    </style>
    
  </head>
  <body style="word-spacing:normal;background-color:#050614;">
    
    
      <div
         style="background-color:#050614;"
      >
        
      
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#050614" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="background:#050614;background-color:#050614;margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#050614;background-color:#050614;width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="width:600px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;"
      >
        <!--[if mso | IE]><table border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td style="vertical-align:middle;width:300px;" ><![endif]-->
                
      <div
         class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:50%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"
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
            <td  style="width:198px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729212110/Logo_ej82qr.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="198"
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
    
              <!--[if mso | IE]></td><td style="vertical-align:middle;width:300px;" ><![endif]-->
                
      <div
         class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:50%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"
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
            <td  style="width:120px;">
              
        <a
           href="#" target="_blank"
        >
          
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729212151/Login_btn_1_gtyoob.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="120"
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
                 style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
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
                   align="center" class="wecome-live-img1" style="font-size:0px;padding:0px;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;" class="mj-full-width-mobile"
      >
        <tbody>
          <tr>
            <td  style="width:600px;" class="mj-full-width-mobile">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729459648/email%20images/Affiliate%20sale/payout%20submited/xzpwuxp40ykzom3osi2z.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600"
      />
    
            </td>
          </tr>
        </tbody>
      </table>
    
                </td>
              </tr>
            
              <tr>
                <td
                   align="center" class="wecome-live-img2" style="font-size:0px;padding:0px;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;" class="mj-full-width-mobile"
      >
        <tbody>
          <tr>
            <td  style="width:600px;" class="mj-full-width-mobile">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729459648/email%20images/Affiliate%20sale/payout%20submited/abzxgs79hsvbcwpvgsab.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600"
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
                 style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
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
                   align="center" style="font-size:0px;padding:0px 10px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-style:Poppins;font-weight:100;line-height:1.6;text-align:center;color:#ffffff;"
      >Hey ${name},</br></br></div>
    
                </td>
              </tr>
            
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0px 20px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-style:Poppins;font-weight:100;line-height:1.6;text-align:center;color:#ffffff;"
      >Your withdrawal request has been <span style="color:#53FC18;">successfully submitted</span> and received.</br></br></div>
    
                </td>
              </tr>
            
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0px 20px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-style:Poppins;font-weight:100;line-height:1.6;text-align:center;color:#ffffff;"
      >Our Vantage Picks back office administrative team will process the payment, which typically takes 24-48 hours.</br></br></div>
    
                </td>
              </tr>
            
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0px 20px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-style:Poppins;font-weight:100;line-height:1.6;text-align:center;color:#ffffff;"
      >Once it has been approved your funds will be uploaded into your desired method.
Please find the details of your request:</div>
    
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
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#050614" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="background:#050614;background-color:#050614;margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#050614;background-color:#050614;width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:25px 30px 0px 30px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="rounded-border-outlook" style="vertical-align:middle;width:350px;" ><![endif]-->
            
      <div
         class="mj-column-px-350 mj-outlook-group-fix rounded-border" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:10px 25px;padding-top:40px;padding-bottom:0px;word-break:break-word;"
                >
                  
      <div
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:18px;font-style:Poppins;font-weight:60;line-height:1.4;text-align:center;color:#ffffff;"
      >Your withdrawal details:</div>
    
                </td>
              </tr>
            
              <tr>
                <td
                   align="center" style="font-size:0px;padding:8px;word-break:break-word;"
                >
                  
      <table
         cellpadding="0" cellspacing="0" width="210" border="0" style="color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:210px;border:none;"
      >
        <tr style="border-bottom:1px solid rgba(255, 255, 255, 0.1);text-align:left;padding:15px 10px;">
            <td style="padding: 5px 5px 0 0; font-size:10px;font-style:'Poppins'">Date requested:</td>
            <td style="padding: 5px 5px 0 0;font-size:10px;font-style:'Poppins'">date requested</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255, 255, 255, 0.1);text-align:left;padding:15px 10px;">
            <td style="padding: 5px 5px 0 0;font-size:10px;font-style:'Poppins'">Login:</td>
            <td style="padding: 5px 5px;font-size:10px;font-style:'Poppins'">[account.login]</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255, 255, 255, 0.1);text-align:left;padding:15px 10px;">
            <td style="padding: 5px 5px 0 0;font-size:10px;font-style:'Poppins'">Withdrawal amount:</td>
            <td style="padding: 5px 5px;font-size:10px;font-style:'Poppins'">amount</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255, 255, 255, 0.1);text-align:left;padding:15px 10px;">
            <td style="padding: 5px 5px 0 0;font-size:10px;font-style:'Poppins'">Payout:</td>
            <td style="padding: 5px 5px;font-size:10px;font-style:'Poppins'">Client payout</td>
          </tr>
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
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
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
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729459648/email%20images/Affiliate%20sale/payout%20submited/t7tndxtwit7rgtyckphe.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="600"
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
    
      
      <!--[if mso | IE]></td></tr></table><![endif]-->
    
    <div class="footer-background">
      
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#050614" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="background:#050614;background-color:#050614;margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#050614;background-color:#050614;width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:15px 15px 0px 15px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:570px;" ><![endif]-->
            
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
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:12px;font-style:Poppins;font-weight:600;line-height:1;text-align:center;color:#ffffff;"
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
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#050614" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="background:#050614;background-color:#050614;margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#050614;background-color:#050614;width:100%;"
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
                       height="20" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729213072/Message_fill_smaza3.png" style="border-radius:3px;display:block;" width="20"
                    />
                  
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        
          <td  style="vertical-align:middle;">
            <span
                     style="color:#ffffff;font-size:13px;font-family:Ubuntu, Helvetica, Arial, sans-serif;line-height:22px;text-decoration:none;">
              support@vantagepicks.com
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
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#050614" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="-0.5, 0" position="-0.5, 0" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729520077/email%20images/ap6zvxwkb9p9pem6mjoc.png" color="#050614" type="frame" size="52px" aspect="atmost" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]-->
          
      <div  style="background:#050614 url('https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729520077/email%20images/ap6zvxwkb9p9pem6mjoc.png') left center / 52px no-repeat;background-position:left center;background-repeat:no-repeat;background-size:52px;margin:0px auto;max-width:600px;">
        <div  style="line-height:0;font-size:0;">
        <table
           align="center" background="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729520077/email%20images/ap6zvxwkb9p9pem6mjoc.png" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#050614 url('https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729520077/email%20images/ap6zvxwkb9p9pem6mjoc.png') left center / 52px no-repeat;background-position:left center;background-repeat:no-repeat;background-size:52px;width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:20px 60px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="footer-icon-outlook" style="width:480px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix footer-icon" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;"
      >
        <!--[if mso | IE]><table border="0" cellpadding="0" cellspacing="0" role="presentation" ><tr><td style="vertical-align:top;width:96px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
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
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729213128/Social_Icon_disscord_pun9p5.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
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
    
              <!--[if mso | IE]></td><td style="vertical-align:top;width:96px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729213127/Social_Icon_insta_kcgtat.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
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
    
              <!--[if mso | IE]></td><td style="vertical-align:top;width:96px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729213130/Social_Icon_Youtube_ko4xg5.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
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
    
              <!--[if mso | IE]></td><td style="vertical-align:top;width:96px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729213129/Social_Icon_x_xxtorz.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
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
    
              <!--[if mso | IE]></td><td style="vertical-align:top;width:96px;" ><![endif]-->
                
      <div
         class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%;"
      >
        
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
      >
        <tbody>
          
              <tr>
                <td
                   align="center" style="font-size:0px;padding:0;word-break:break-word;"
                >
                  
      <table
         border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
      >
        <tbody>
          <tr>
            <td  style="width:38px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729213131/Social_Icon_telegram_plb0cw.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="38"
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
      </div>
    
        <!--[if mso | IE]></v:textbox></v:rect></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#050614" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="background:#050614;background-color:#050614;margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#050614;background-color:#050614;width:100%;"
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
            <td  style="width:550px;">
              
      <img
         height="auto" src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729213286/Vantage Picks_aubaeh.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="550"
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
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#050614" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div  style="background:#050614;background-color:#050614;margin:0px auto;max-width:600px;">
        
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#050614;background-color:#050614;width:100%;"
        >
          <tbody>
            <tr>
              <td
                 style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="background-text-header-outlook" style="vertical-align:top;width:600px;" ><![endif]-->
            
      <div
         class="mj-column-per-100 mj-outlook-group-fix background-text-header" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
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
         style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:10px;line-height:1;text-align:center;color:#ffffff;"
      >Disclaimer: The content and services provided by Vantage Picks are for educational and entertainment purposes only. We do not promote or facilitate real-money gambling. All activities on our platform are based on simulated data, and no real financial risk is involved. Users are responsible for ensuring compliance with local laws and regulations regarding sports betting and gambling. Contact support@vantagepicks.com for more information.</div>
    
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
    
    </div>
      </div>
    
  </body>
</html>
  `);
    return {
        title: PAYOUT_SUBMITTED_TITLE,
        template: PAYOUT_SUBMITTED_TEMPLATE,
    };
}

export const getAffiliatePayoutAcceptedEmailTemplate = (name: string) => {
    const AFFILIATE_PAYOUT_ACCEPTED_TITLE = "Affiliate Payout Accepted";
    const AFFILIATE_PAYOUT_ACCEPTED_TEMPLATE = `<p>Hello <strong>${name}</strong>,</p><p>Your affiliate payout request has been accepted and will be processed shortly.</p>`;
    return {
        title: AFFILIATE_PAYOUT_ACCEPTED_TITLE,
        template: AFFILIATE_PAYOUT_ACCEPTED_TEMPLATE,
    };
}

export const getAffiliatePayoutRejectedEmailTemplate = (name: string) => {
    const AFFILIATE_PAYOUT_REJECTED_TITLE = "Affiliate Payout Rejected";
    const AFFILIATE_PAYOUT_REJECTED_TEMPLATE = `<p>Hello <strong>${name}</strong>,</p><p>Your affiliate payout request has been rejected. Please contact support for more information.</p>`;
    return {
        title: AFFILIATE_PAYOUT_REJECTED_TITLE,
        template: AFFILIATE_PAYOUT_REJECTED_TEMPLATE,
    };
}

export const getAffiliatePayoutSubmittedEmailTemplate = (name: string) => {
    const AFFILIATE_PAYOUT_SUBMITTED_TITLE = "Affiliate Payout Submitted";
    const AFFILIATE_PAYOUT_SUBMITTED_TEMPLATE = `<p>Hello <strong>${name}</strong>,</p><p>Your affiliate payout request has been submitted and is pending approval.</p>`;
    return {
        title: AFFILIATE_PAYOUT_SUBMITTED_TITLE,
        template: AFFILIATE_PAYOUT_SUBMITTED_TEMPLATE,
    };
}
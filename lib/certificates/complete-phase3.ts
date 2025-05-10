import { Account } from "@prisma/client";

export const getCompletePhase3Certificate = (
  userName: string,
  account: Account
) => {
  const title = "Phase 3 Complete Certificate";
  const template = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Challenge Passed Certificate</title>
	<style type="text/css">

		*{
    		margin: 0;
   			padding: 0;
    		box-sizing: border-box;
		}
		body{

            font-family: Poppins;
		}
		hr{

			color: wheat;
		}
        .background-containe{
            
				background-image: url("https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729855021/email%20images/PiksHero/Cetificates/Passed_Phase_6_fobiaw.png");
      			background-repeat: no-repeat;
      			background-size: contain;
      			background-position: center;
      			height: 555px;
      			padding-top: 30px;
            
        }
        .flex {
            display: flex;
            justify-content: space-between;
            vertical-align:middle;
        }

        .flex div {
            padding: 1em
        }
        .top-left-title{
            color: white;
            text-transform: uppercase;
            font-size: 22px;
            letter-spacing: 5px;
            font-weight:300;
        }
        .top-right-title{
            color: white;
            text-transform: uppercase;
            font-size: 24px;
            letter-spacing: 1px;
            font-weight:700;
            line-height: 28px;
            text-align: center;
        }

	</style>
</head>
<body>

	
	<div style="margin: 0px auto; padding:5px 30px; width: 950px;);" class="background-containe">
        
        <div class="flex">
            <div class="top-left-title"><img src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729855378/email%20images/PiksHero/Cetificates/Logo_nm3ifh.png" width="48px"></div>
            <div class="top-right-title">Account sim:<br> $${account.accountSize}</div>
        </div>
        <div style="margin-top: -30px;">
            <img src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729855019/email%20images/PiksHero/Cetificates/Earn_Big_title_raqcvu.png" width="405px" style="display: block;
  margin-left: auto;
  margin-right: auto;">
        </div>
        <center style="padding-top: 33px;">
        <div style="padding:5px;background-color: rgba(255,255,255,0.1);width: 224px; border-radius: 5px;">
            <p style="text-transform: uppercase;color: white;font-weight:600;font-size:20px;">Congratulations</p>
        </div>
            </center>
        
         <center style="padding-top: 20px;">
        <div>
            <p style="text-transform: uppercase;color: #96FF72;font-weight:600;font-size:24px; padding: 3px 0px;"> Phase 3
            </p>
        </div>
            </center>
       
         <center style="padding-top: 10px;">
        <div>
            <p style="text-transform: uppercase;color: #ffffff;font-weight:600;font-size:54px;">${userName}</p>
        </div>
            </center>
        
        <center>
          <div>
            <p style="text-transform: uppercase;color: #ffffff;font-weight:600;font-size:18px; padding-top: 20px;"> date: ${new Date().toLocaleDateString()}</p>
        </div>
            </center>
    
    </div>
</body>
</html>`;

  return {
    title,
    template,
  };
};

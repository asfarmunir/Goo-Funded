import { Account } from "@prisma/client";

export const getPayoutCertificate = (userName: string, account: Account, lastPayout: number) => {

    const title = "Profit Payout Certificate";
    const template = (`<!DOCTYPE html>
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
            
				background-image: url("https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729863231/email%20images/PiksHero/Cetificates/Payout_w1jzhp.png");
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
            <div class="top-right-title">Account sim:<br> $100,000</div>
        </div>
        <div style="margin-top: -50px;">
            <img src="https://res.cloudinary.com/unionwealthmanagement/image/upload/v1729855020/email%20images/PiksHero/Cetificates/Payout_title_mhfo5i.png" width="751.36px" style="display: block;
  margin-left: auto;
  margin-right: auto;">
        </div>
        <center style="padding-top: 33px;">
        <div style="padding:5px;background-color: rgba(255,255,255,0.1);width: 224px; border-radius: 5px;">
            <p style="text-transform: uppercase;color: white;font-weight:600;font-size:20px;">PAYOUT AMOUNT</p>
        </div>
            </center>

         <center style="padding-top: 13px;">
        <div>
            <p style="text-transform: uppercase;color: #ffffff;font-weight:600;font-size:81px;"> $${lastPayout.toLocaleString()}</p>
        </div>
            </center>
        
        <center>
          <div>
            <p style="text-transform: uppercase;color: #ffffff;font-weight:600;font-size:18px;"> date: ${new Date().toLocaleDateString()}</p>
        </div>
            </center>
        
        <div class="flex" style="padding-top: 30px;">
            <div class="top-left-title"></div>
            <div class="top-right-title"><p style="text-transform: uppercase;color: #53FC18;font-weight:600;font-size:12px; text-align: center;">Pro Better</p>
            <p style="text-transform: uppercase;color: #ffffff;font-weight:600;font-size:32px; text-align: center;">${userName}</p>
            </div>
        </div>
    
    </div>
</body>
</html>`)

    return { title, template }
}
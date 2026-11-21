"""No paid AI; renders one 30s vertical reel from explicitly approved jobs."""
import datetime, json, math, os, random, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = Path("reel-output")
OUT.mkdir(exist_ok=True)
data = json.loads((ROOT / "jobs.json").read_text())
today = datetime.date.today()
approved = [j for j in data["items"] if j.get("status") == "approved"
            and datetime.date.fromisoformat(j["approved_until"]) >= today]
if not approved:
    (OUT / "REVIEW_REQUIRED.txt").write_text(
        "No approved, unexpired hiring item. No MP4 created. Approve a job in jobs.json first.\n")
    print("No approved job: safely skipped rendering.")
    raise SystemExit(0)
job = approved[today.toordinal() % len(approved)]
W,H,FPS,DURATION = 540,960,12,30
fontpath = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font = lambda n: ImageFont.truetype(fontpath,n)
slides = [
    ("CAREERSYNC", [data["brand"], "HIRING NOW"]),
    (job["title"].upper(), [job["location"], job["eligibility"]]),
    ("SALARY", [job["salary"]]),
    ("OPEN ROLES", job["roles"]),
    ("APPLY TODAY", ["WhatsApp: "+data["whatsapp"], "Send your resume"]),
    ("CAREERSYNC", ["bechnaseekho.com/careersync", "Follow for job updates"]),
]
def centered(d, text, y, size, fill):
    f=font(size)
    # shrink to fit width
    while d.textbbox((0,0),text,font=f)[2] > W-56 and size > 15:
        size-=2; f=font(size)
    box=d.textbbox((0,0),text,font=f)
    d.text(((W-(box[2]-box[0]))/2,y),text,font=f,fill=fill)
def render_frame(i):
    t=i/FPS
    slide=min(5,int(t//5))
    im=Image.new("RGB",(W,H),(4,12,37))
    d=ImageDraw.Draw(im)
    # animated neon perspective and moving light grid
    for k in range(12):
        x=(k*67+int(t*19))%W
        d.line((W//2,290,x,H),fill=(7,56,104),width=2)
    for k in range(13):
        y=int(290+((k/13+t*.11)%1)**2*730)
        d.line((0,y,W,y),fill=(8,80,139),width=2)
    for k in range(28):
        x=(k*131+int(17*t))%W
        y=(k*97+int(29*t))%H
        d.ellipse((x,y,x+3,y+3),fill=(30,157,229))
    d.rounded_rectangle((25,220,W-25,755),radius=28,fill=(5,19,53),outline=(29,151,218),width=3)
    centered(d,slides[slide][0],280,49,(75,215,255))
    for k,line in enumerate(slides[slide][1]):
        centered(d,line,420+k*73,32,(255,255,255) if k%2==0 else (255,207,99))
    centered(d,"BechNaSeekho",52,31,(255,255,255))
    d.rectangle((25,865,25+int((W-50)*t/DURATION),872),fill=(50,205,255))
    return im
with tempfile.TemporaryDirectory() as tmp:
    for i in range(FPS*DURATION):
        render_frame(i).save(Path(tmp)/f"{i:04d}.png")
    cmd=["ffmpeg","-hide_banner","-loglevel","error","-y","-framerate",str(FPS),
         "-i",str(Path(tmp)/"%04d.png"),"-f","lavfi","-i",
         "anullsrc=channel_layout=stereo:sample_rate=44100","-t",str(DURATION),
         "-c:v","libx264","-pix_fmt","yuv420p","-preset","veryfast","-crf","24",
         "-c:a","aac","-shortest",str(OUT/"careersync-daily-reel.mp4")]
    subprocess.run(cmd,check=True)
(OUT/"review.txt").write_text(
    f"Date: {today}\nJob: {job['id']}\nStatus: FOR APPROVAL ONLY. DO NOT AUTO-PUBLISH.\n"
    f"Format: vertical 9:16, 30 seconds, silent motion graphics.\n"
    f"Title: {job['title']} | CareerSync #Shorts\n"
    f"Caption: {job['location']} | {job['salary']} | Apply: {data['website']}\n")
print("Reel generated for review:",OUT/"careersync-daily-reel.mp4")

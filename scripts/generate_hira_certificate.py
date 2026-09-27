import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def draw_gold_medal(draw, center_x, center_y, radius, ribbon_color=(25, 55, 130)):
    # Draw ribbon tails hanging down
    rw = radius * 0.45
    rh = radius * 1.5
    # Left ribbon
    draw.polygon([
        (center_x - radius*0.5, center_y),
        (center_x - radius*0.5 + rw, center_y),
        (center_x - radius*0.5 + rw, center_y + rh),
        (center_x - radius*0.5 + rw*0.5, center_y + rh - 25),
        (center_x - radius*0.5, center_y + rh)
    ], fill=ribbon_color)
    # Right ribbon
    draw.polygon([
        (center_x + radius*0.5 - rw, center_y),
        (center_x + radius*0.5, center_y),
        (center_x + radius*0.5, center_y + rh),
        (center_x + radius*0.5 - rw*0.5, center_y + rh - 25),
        (center_x + radius*0.5 - rw, center_y + rh)
    ], fill=ribbon_color)

    # Gold outer rays/scallops
    num_points = 36
    for i in range(num_points):
        angle = i * (2 * math.pi / num_points)
        px = center_x + math.cos(angle) * (radius + 10)
        py = center_y + math.sin(angle) * (radius + 10)
        draw.ellipse([px-14, py-14, px+14, py+14], fill=(218, 165, 32))

    # Gold medal body
    draw.ellipse([center_x - radius, center_y - radius, center_x + radius, center_y + radius], fill=(225, 175, 45), outline=(180, 130, 20), width=4)
    # Inner ring
    draw.ellipse([center_x - radius*0.85, center_y - radius*0.85, center_x + radius*0.85, center_y + radius*0.85], fill=(245, 205, 75), outline=(190, 140, 25), width=3)
    draw.ellipse([center_x - radius*0.75, center_y - radius*0.75, center_x + radius*0.75, center_y + radius*0.75], fill=(235, 185, 50), outline=(210, 160, 30), width=2)

    # Text inside medal: "1" and "등급"
    try:
        f_num = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", int(radius * 0.75))
        f_sub = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", int(radius * 0.28))
    except:
        f_num = ImageFont.load_default()
        f_sub = ImageFont.load_default()

    # Draw "1"
    draw.text((center_x, center_y - radius * 0.28), "1", fill=(255, 255, 255), font=f_num, anchor="mm")
    # Draw "등급"
    draw.text((center_x, center_y + radius * 0.35), "등급", fill=(255, 255, 255), font=f_sub, anchor="mm")

def draw_official_stamp(draw, x, y, size=110):
    # Square red seal
    draw.rectangle([x, y, x + size, y + size], outline=(195, 35, 35), width=6)
    draw.rectangle([x+6, y+6, x + size-6, y + size-6], outline=(195, 35, 35), width=2)
    # Character grid for "건강보험심사평가원장인"
    try:
        f_seal = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 22)
    except:
        f_seal = ImageFont.load_default()
    
    chars = [["건강", "보험"], ["심사", "평가"], ["원장", "의인"]]
    cx = x + 16
    cy = y + 14
    for r in range(3):
        for c in range(2):
            draw.text((cx + c*44, cy + r*28), chars[r][c], fill=(195, 35, 35), font=f_seal)

def create_hira_cert(cert_type="diabetes", output_path="scratch/hira_cert.jpg"):
    W, H = 1400, 1980
    im = Image.new("RGB", (W, H), color=(253, 253, 252))
    draw = ImageDraw.Draw(im)

    # Outer decorative borders (Navy & Gold)
    # Outer navy line
    draw.rectangle([40, 40, W-40, H-40], outline=(30, 58, 110), width=6)
    # Inner gold line
    draw.rectangle([56, 56, W-56, H-56], outline=(205, 160, 55), width=3)
    draw.rectangle([66, 66, W-66, H-66], outline=(205, 160, 55), width=1)
    
    # Elegant corner accents
    corner_size = 45
    for (cx, cy) in [(66, 66), (W-66, 66), (66, H-66), (W-66, H-66)]:
        draw.rectangle([cx-10, cy-10, cx+10, cy+10], fill=(205, 160, 55))

    # Top right gold medal
    draw_gold_medal(draw, W - 230, 260, radius=110, ribbon_color=(25, 60, 135))

    # Fonts
    f_sub = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 38)
    f_title = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 74)
    f_meta = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 40)
    f_meta_bd = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 42)
    f_body = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 46)
    f_en = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 30)
    f_date = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 40)
    f_sign = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 48)

    # Header
    draw.text((W//2, 450), "2주기 2차 고혈압·당뇨병", fill=(70, 85, 110), font=f_sub, anchor="mm")
    
    if cert_type == "diabetes":
        main_title = "당뇨병 적정성 평가"
        en_type = "diabetes mellitus"
    else:
        main_title = "고혈압 적정성 평가"
        en_type = "hypertension"

    draw.text((W//2, 545), main_title, fill=(20, 35, 65), font=f_title, anchor="mm")
    draw.text((W//2, 645), "1등급 기관", fill=(20, 35, 65), font=f_title, anchor="mm")

    # Divider bar
    draw.line([(W//2 - 250, 725), (W//2 + 250, 725)], fill=(205, 160, 55), width=3)

    # Info Block
    draw.text((W//2, 825), "기 관 명 :  상우내과의원", fill=(30, 41, 59), font=f_meta_bd, anchor="mm")
    draw.text((W//2, 905), "평가기간 : 2024. 3. ~ 2025. 2.", fill=(71, 85, 105), font=f_meta, anchor="mm")

    # Body
    draw.text((W//2, 1070), f"귀 원은 {cert_type == 'diabetes' and '당뇨병' or '고혈압'} 적정성 평가 결과가", fill=(15, 23, 42), font=f_body, anchor="mm")
    draw.text((W//2, 1145), "우수한 1등급 기관으로 선정되었습니다.", fill=(15, 23, 42), font=f_body, anchor="mm")

    # English Notice
    en_lines = [
        "This certificate confirms that your esteemed hospital has been",
        f"selected as a first class health care institution pursuant to",
        f"the quality assessment of {en_type} management."
    ]
    ey = 1270
    for el in en_lines:
        draw.text((W//2, ey), el, fill=(100, 116, 139), font=f_en, anchor="mm")
        ey += 46

    # Date
    draw.text((W//2, 1530), "2025년 12월 22일", fill=(30, 41, 59), font=f_date, anchor="mm")

    # Authority & Stamp
    draw.text((W//2 - 50, 1660), "건강보험심사평가원장", fill=(15, 23, 42), font=f_sign, anchor="mm")
    draw_official_stamp(draw, W//2 + 180, 1605, size=110)

    im.save(output_path, quality=95)
    print(f"Generated {output_path}")

create_hira_cert("diabetes", "scratch/hira_diabetes.jpg")
create_hira_cert("hypertension", "scratch/hira_hypertension.jpg")

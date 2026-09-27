import math
from PIL import Image, ImageDraw, ImageFont

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
    f_num = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", int(radius * 0.75))
    f_sub = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", int(radius * 0.28))

    draw.text((center_x, center_y - radius * 0.28), "1", fill=(255, 255, 255), font=f_num, anchor="mm")
    draw.text((center_x, center_y + radius * 0.35), "등급", fill=(255, 255, 255), font=f_sub, anchor="mm")

def create_hira_cert(cert_type="diabetes", output_path="images/sangwoo-diabetes-grade1-certificate.jpg"):
    W, H = 1400, 1920
    im = Image.new("RGB", (W, H), color=(253, 253, 252))
    draw = ImageDraw.Draw(im)

    # Outer decorative borders (Navy & Gold)
    draw.rectangle([40, 40, W-40, H-40], outline=(30, 58, 110), width=6)
    draw.rectangle([56, 56, W-56, H-56], outline=(205, 160, 55), width=3)
    draw.rectangle([66, 66, W-66, H-66], outline=(205, 160, 55), width=1)
    
    # Elegant corner accents
    for (cx, cy) in [(66, 66), (W-66, 66), (66, H-66), (W-66, H-66)]:
        draw.rectangle([cx-10, cy-10, cx+10, cy+10], fill=(205, 160, 55))

    # Top right gold medal
    draw_gold_medal(draw, W - 230, 260, radius=110, ribbon_color=(25, 60, 135))

    # Fonts
    f_sub = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 38)
    f_title = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 76)
    f_meta = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 42)
    f_meta_bd = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 44)
    f_body = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 48)
    f_en = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 32)
    f_date = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 42)

    # Header
    draw.text((W//2, 450), "2주기 2차 고혈압·당뇨병", fill=(70, 85, 110), font=f_sub, anchor="mm")
    
    if cert_type == "diabetes":
        main_title = "당뇨병 적정성 평가"
        en_type = "diabetes mellitus"
        disease_kr = "당뇨병"
    else:
        main_title = "고혈압 적정성 평가"
        en_type = "hypertension"
        disease_kr = "고혈압"

    draw.text((W//2, 550), main_title, fill=(20, 35, 65), font=f_title, anchor="mm")
    draw.text((W//2, 655), "1등급 기관", fill=(20, 35, 65), font=f_title, anchor="mm")

    # Divider bar
    draw.line([(W//2 - 260, 745), (W//2 + 260, 745)], fill=(205, 160, 55), width=3)

    # Info Block
    draw.text((W//2, 860), "기 관 명 :  상우내과의원", fill=(30, 41, 59), font=f_meta_bd, anchor="mm")
    draw.text((W//2, 945), "평가기간 : 2024. 3. ~ 2025. 2.", fill=(71, 85, 105), font=f_meta, anchor="mm")

    # Body
    draw.text((W//2, 1120), f"귀 원은 {disease_kr} 적정성 평가 결과가", fill=(15, 23, 42), font=f_body, anchor="mm")
    draw.text((W//2, 1200), "우수한 1등급 기관으로 선정되었습니다.", fill=(15, 23, 42), font=f_body, anchor="mm")

    # English Notice
    en_lines = [
        "This certificate confirms that your esteemed hospital has been",
        f"selected as a first class health care institution pursuant to",
        f"the quality assessment of {en_type} management."
    ]
    ey = 1330
    for el in en_lines:
        draw.text((W//2, ey), el, fill=(100, 116, 139), font=f_en, anchor="mm")
        ey += 50

    # Clean bottom date and accent (no awkward fake stamp or conferral title)
    draw.line([(W//2 - 160, 1550), (W//2 + 160, 1550)], fill=(205, 160, 55), width=2)
    draw.text((W//2, 1625), "2025년 12월 22일", fill=(40, 55, 80), font=f_date, anchor="mm")

    im.save(output_path, quality=95)
    print(f"Generated {output_path}")

if __name__ == "__main__":
    create_hira_cert("diabetes", "images/sangwoo-diabetes-grade1-certificate.jpg")
    create_hira_cert("hypertension", "images/sangwoo-hypertension-grade1-certificate.jpg")

import math
from PIL import Image, ImageDraw, ImageFont

def draw_curved_text(im, text, cx, cy, radius, start_angle, end_angle, font, fill_color, direction="top"):
    n = len(text)
    if n == 0:
        return
    step = (end_angle - start_angle) / max(n - 1, 1) if n > 1 else 0
    for i, ch in enumerate(text):
        ang_deg = start_angle + i * step
        ang_rad = math.radians(ang_deg)
        x = cx + radius * math.cos(ang_rad)
        y = cy + radius * math.sin(ang_rad)

        char_img = Image.new('RGBA', (70, 70), (0, 0, 0, 0))
        cdraw = ImageDraw.Draw(char_img)
        cdraw.text((35, 35), ch, font=font, fill=fill_color, anchor="mm")

        if direction == "top":
            rot = 90 + ang_deg
        else:
            rot = ang_deg - 90

        rotated = char_img.rotate(-rot, resample=Image.BICUBIC)
        px = int(x - rotated.width / 2)
        py = int(y - rotated.height / 2)
        im.alpha_composite(rotated, (px, py))

def create_ksde_watermark_layer(W, H, cx, cy, radius=210):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    terracotta = (195, 100, 85, 48)
    terracotta_light = (195, 100, 85, 30)

    # Concentric circles
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], outline=terracotta, width=6)
    draw.ellipse([cx - radius + 10, cy - radius + 10, cx + radius - 10, cy + radius - 10], outline=terracotta_light, width=2)
    draw.ellipse([cx - radius + 48, cy - radius + 48, cx + radius - 48, cy + radius - 48], outline=terracotta, width=3)

    # Arc text
    f_arc_en = ImageFont.truetype("C:/Windows/Fonts/cambriab.ttf", 20)
    f_arc_kr = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 20)

    # Top arc
    draw_curved_text(layer, "THE KOREAN SOCIETY OF DIGESTIVE ENDOSCOPY", cx, cy, radius - 24, -165, -15, f_arc_en, terracotta, direction="top")
    # Bottom arc
    draw_curved_text(layer, "대 한 위 대 장 내 시 경 학 회", cx, cy, radius - 24, 155, 25, f_arc_kr, terracotta, direction="bottom")

    # Center KSDE & 2003
    f_ksde = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 32)
    f_year = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 20)
    draw.text((cx - 60, cy - 22), "KSDE", fill=terracotta, font=f_ksde, anchor="mm")
    draw.text((cx - 60, cy + 20), "2003", fill=terracotta, font=f_year, anchor="mm")

    # GI Tract Line Art
    # Esophagus tube
    draw.line([(cx + 32, cy - 100), (cx + 32, cy - 75)], fill=terracotta, width=5)
    # Stomach
    draw.ellipse([cx - 5, cy - 80, cx + 70, cy - 10], outline=terracotta, width=5)
    # Small intestine / Duodenum loops
    draw.arc([cx - 20, cy + 5, cx + 75, cy + 60], start=330, end=190, fill=terracotta, width=5)
    draw.arc([cx - 15, cy + 35, cx + 80, cy + 95], start=150, end=380, fill=terracotta, width=5)

    return layer

def draw_luxurious_gold_seal(im, cx, cy, radius=100):
    layer = Image.new('RGBA', im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    # 48-tooth serrated star
    num_teeth = 48
    points = []
    for i in range(num_teeth * 2):
        angle = i * (math.pi / num_teeth)
        r = (radius + 12) if i % 2 == 0 else (radius - 2)
        px = cx + math.cos(angle) * r
        py = cy + math.sin(angle) * r
        points.append((px, py))

    # Gold body layers
    draw.polygon(points, fill=(215, 170, 60, 255), outline=(175, 130, 35, 255))
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(232, 188, 70, 255), outline=(180, 135, 38, 255), width=3)
    draw.ellipse([cx - radius*0.9, cy - radius*0.9, cx + radius*0.9, cy + radius*0.9], outline=(255, 240, 150, 255), width=3)
    draw.ellipse([cx - radius*0.82, cy - radius*0.82, cx + radius*0.82, cy + radius*0.82], fill=(222, 178, 58, 255), outline=(165, 120, 30, 255), width=2)
    draw.ellipse([cx - radius*0.74, cy - radius*0.74, cx + radius*0.74, cy + radius*0.74], outline=(245, 215, 120, 255), width=2)
    draw.ellipse([cx - radius*0.66, cy - radius*0.66, cx + radius*0.66, cy + radius*0.66], fill=(235, 192, 75, 255), outline=(185, 140, 40, 255), width=1)

    # Micro text in seal
    f_seal_title = ImageFont.truetype("C:/Windows/Fonts/cambriab.ttf", 14)
    f_seal_center = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 19)
    draw.text((cx, cy - 32), "KOREAN SOCIETY", fill=(130, 90, 20, 255), font=f_seal_title, anchor="mm")
    draw.text((cx, cy - 14), "OF DIGESTIVE ENDOSCOPY", fill=(130, 90, 20, 255), font=ImageFont.truetype("C:/Windows/Fonts/cambriab.ttf", 10), anchor="mm")
    draw.text((cx, cy + 12), "KSDE", fill=(115, 75, 15, 255), font=f_seal_center, anchor="mm")
    draw.text((cx, cy + 34), "OFFICIAL SEAL", fill=(130, 90, 20, 255), font=ImageFont.truetype("C:/Windows/Fonts/cambriab.ttf", 11), anchor="mm")

    im.alpha_composite(layer)

def draw_official_ksde_stamp(im, x, y, size=108):
    layer = Image.new('RGBA', im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    red_col = (195, 30, 30, 235)
    # Double square border
    draw.rectangle([x, y, x + size, y + size], outline=red_col, width=5)
    draw.rectangle([x+6, y+6, x + size-6, y + size-6], outline=red_col, width=2)

    # 12 characters: 대한위대 / 장내시경 / 학회장인
    cols = [
        ['대', '한', '위', '대'],
        ['장', '내', '시', '경'],
        ['학', '회', '장', '인']
    ]
    f_stamp = ImageFont.truetype("C:/Windows/Fonts/HANBatangB.ttf", 20)

    # 3 columns, right-to-left
    for c_idx, col in enumerate(cols):
        cx = x + size - 22 - c_idx * 31
        for r_idx, ch in enumerate(col):
            cy = y + 18 + r_idx * 23
            draw.text((cx, cy), ch, font=f_stamp, fill=red_col, anchor="mm")

    im.alpha_composite(layer)

def create_ksde_cert(cert_type="gastro", output_path="scratch/ksde_cert.jpg"):
    W, H = 2000, 1414
    # Warm premium ivory parchment background
    im = Image.new("RGBA", (W, H), color=(253, 251, 247, 255))
    draw = ImageDraw.Draw(im)

    # Elegant frame
    draw.rectangle([45, 45, W - 45, H - 45], outline=(40, 40, 40), width=3)
    draw.rectangle([56, 56, W - 56, H - 56], outline=(195, 155, 65), width=2)
    draw.rectangle([64, 64, W - 64, H - 64], outline=(195, 155, 65), width=1)

    for cx, cy in [(64, 64), (W - 64, 64), (64, H - 64), (W - 64, H - 64)]:
        draw.rectangle([cx - 8, cy - 8, cx + 8, cy + 8], fill=(195, 155, 65))

    # Center Watermark
    watermark_layer = create_ksde_watermark_layer(W, H, W // 2 + 40, H // 2 + 10, radius=210)
    im.alpha_composite(watermark_layer)

    # Fonts
    f_cert_no = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 26)
    f_main_head = ImageFont.truetype("C:/Windows/Fonts/OLDENGL.TTF", 58)
    f_title_kr = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 48)
    f_title_kr_sub = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 42)
    f_meta_kr = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 30)
    f_body_kr = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 34)
    f_sign_kr = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 36)

    f_title_en = ImageFont.truetype("C:/Windows/Fonts/OLDENGL.TTF", 46)
    f_name_en = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 36)
    f_body_en1 = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 28)
    f_body_en_soc = ImageFont.truetype("C:/Windows/Fonts/OLDENGL.TTF", 34)
    f_body_en2 = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 28)
    f_spec_en = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 32)

    f_chair_sig = ImageFont.truetype("C:/Windows/Fonts/FRSCRIPT.TTF", 62)
    f_chair_name = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 26)
    f_chair_sub = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 20)

    # Serial Number (Top Left)
    cert_no = "제1601-1763 호" if cert_type == "gastro" else "제1602-1456 호"
    draw.text((120, 115), cert_no, fill=(40, 40, 40), font=f_cert_no)

    # Top Heading
    draw.text((W // 2, 145), "The Korean Society of Digestive Endoscopy", fill=(25, 25, 25), font=f_main_head, anchor="mm")
    draw.line([(W // 2 - 430, 190), (W // 2 + 430, 190)], fill=(195, 155, 65), width=2)

    left_cx = 530
    right_cx = 1470

    if cert_type == "gastro":
        kr_specialty = "위내시경전문의"
        en_specialty = "A Specialist in Esophagogastroduodenoscopy"
    else:
        kr_specialty = "대장내시경전문의"
        en_specialty = "A Specialist in Colonoscopy"

    # --- LEFT COLUMN (Korean) ---
    draw.text((left_cx, 320), kr_specialty, fill=(20, 20, 20), font=f_title_kr, anchor="mm")
    draw.text((left_cx, 395), "자   격   인   정   증", fill=(20, 20, 20), font=f_title_kr_sub, anchor="mm")

    ky = 520
    meta_x = 240
    draw.text((meta_x, ky), "성          명 :   박   상   우", fill=(30, 30, 30), font=f_meta_kr)
    draw.text((meta_x, ky + 58), "의사면허번호 :   55393", fill=(30, 30, 30), font=f_meta_kr)
    draw.text((meta_x, ky + 116), "기          간 :   2026.09.01 ~ 2031.08.30", fill=(30, 30, 30), font=f_meta_kr)

    draw.text((meta_x, 770), "대한위대장내시경학회는 위와 같이", fill=(20, 20, 20), font=f_body_kr)
    draw.text((meta_x, 835), f"{kr_specialty} 자격을 인정함.", fill=(20, 20, 20), font=f_body_kr)

    # Signoff on bottom left
    # "대한위대장내시경학회장"
    draw.text((meta_x, 1120), "대한위대장내시경학회장", fill=(20, 20, 20), font=f_sign_kr, anchor="lt")
    # Position stamp to overlap '장' slightly
    draw_official_ksde_stamp(im, meta_x + 395, 1070, size=108)

    # --- RIGHT COLUMN (English) ---
    draw.text((right_cx, 320), "Certificate of Qualification", fill=(25, 25, 25), font=f_title_en, anchor="mm")
    draw.text((right_cx, 435), "Park Sang Woo", fill=(25, 25, 25), font=f_name_en, anchor="mm")

    draw.text((right_cx, 540), "This is to certify that", fill=(50, 50, 50), font=f_body_en1, anchor="mm")
    draw.text((right_cx, 595), "The Korean Society of Digestive Endoscopy", fill=(25, 25, 25), font=f_body_en_soc, anchor="mm")
    draw.text((right_cx, 655), "acknowledges the above-mentioned as", fill=(50, 50, 50), font=f_body_en2, anchor="mm")
    draw.text((right_cx, 720), en_specialty, fill=(20, 20, 20), font=f_spec_en, anchor="mm")

    # Signoff (Bottom Right)
    chair_x = 1310
    draw.text((chair_x, 1025), "Eun Soo Hoon", fill=(25, 25, 25), font=f_chair_sig, anchor="mm")
    draw.text((chair_x, 1085), "Eun Soo Hoon, M.D., Ph.D.", fill=(30, 30, 30), font=f_chair_name, anchor="mm")
    draw.text((chair_x, 1120), "Chairman", fill=(70, 70, 70), font=f_chair_sub, anchor="mm")
    draw.text((chair_x, 1148), "The Korean Society of Digestive Endoscopy", fill=(70, 70, 70), font=f_chair_sub, anchor="mm")

    # Gold Seal
    draw_luxurious_gold_seal(im, 1720, 1105, radius=95)

    final_rgb = im.convert("RGB")
    final_rgb.save(output_path, quality=95)
    print(f"Generated {output_path} successfully!")

if __name__ == "__main__":
    create_ksde_cert("gastro", "scratch/ksde_gastro.jpg")
    create_ksde_cert("colono", "scratch/ksde_colono.jpg")

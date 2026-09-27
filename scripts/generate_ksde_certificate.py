import math
from PIL import Image, ImageDraw, ImageFont

def create_clean_ksde_cert(cert_type="gastro", output_path="images/sangwoo-gastroscopy-specialist-certificate.jpg"):
    W, H = 2000, 1320
    # Warm premium ivory parchment background
    im = Image.new("RGB", (W, H), color=(253, 251, 247))
    draw = ImageDraw.Draw(im)

    # Elegant frame
    draw.rectangle([45, 45, W - 45, H - 45], outline=(40, 40, 40), width=3)
    draw.rectangle([56, 56, W - 56, H - 56], outline=(195, 155, 65), width=2)
    draw.rectangle([64, 64, W - 64, H - 64], outline=(195, 155, 65), width=1)

    for cx, cy in [(64, 64), (W - 64, 64), (64, H - 64), (W - 64, H - 64)]:
        draw.rectangle([cx - 8, cy - 8, cx + 8, cy + 8], fill=(195, 155, 65))

    # Fonts
    f_cert_no = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 26)
    f_main_head = ImageFont.truetype("C:/Windows/Fonts/OLDENGL.TTF", 62)
    f_title_kr = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 52)
    f_title_kr_sub = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 44)
    f_meta_kr = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 32)
    f_body_kr = ImageFont.truetype("C:/Windows/Fonts/batang.ttc", 36)

    f_title_en = ImageFont.truetype("C:/Windows/Fonts/OLDENGL.TTF", 50)
    f_name_en = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 40)
    f_body_en1 = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 30)
    f_body_en_soc = ImageFont.truetype("C:/Windows/Fonts/OLDENGL.TTF", 36)
    f_body_en2 = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 30)
    f_spec_en = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 34)

    # Serial Number (Top Left)
    cert_no = "제1601-1763 호" if cert_type == "gastro" else "제1602-1456 호"
    draw.text((120, 115), cert_no, fill=(40, 40, 40), font=f_cert_no)

    # Top Heading
    draw.text((W // 2, 160), "The Korean Society of Digestive Endoscopy", fill=(25, 25, 25), font=f_main_head, anchor="mm")
    draw.line([(W // 2 - 460, 215), (W // 2 + 460, 215)], fill=(195, 155, 65), width=2)

    left_cx = 530
    right_cx = 1470

    if cert_type == "gastro":
        kr_specialty = "위내시경전문의"
        kr_specialty_title = "위 내 시 경 전 문 의"
        en_specialty = "A Specialist in Esophagogastroduodenoscopy"
    else:
        kr_specialty = "대장내시경전문의"
        kr_specialty_title = "대 장 내 시 경 전 문 의"
        en_specialty = "A Specialist in Colonoscopy"

    # --- LEFT COLUMN (Korean) ---
    draw.text((left_cx, 350), kr_specialty_title, fill=(20, 20, 20), font=f_title_kr, anchor="mm")
    draw.text((left_cx, 435), "자   격   인   정   증", fill=(20, 20, 20), font=f_title_kr_sub, anchor="mm")
    draw.line([(left_cx - 180, 495), (left_cx + 180, 495)], fill=(215, 185, 115), width=1)

    ky = 575
    meta_x = 240
    draw.text((meta_x, ky), "성          명 :   박   상   우", fill=(30, 30, 30), font=f_meta_kr)
    draw.text((meta_x, ky + 68), "의사면허번호 :   55393", fill=(30, 30, 30), font=f_meta_kr)
    draw.text((meta_x, ky + 136), "기          간 :   2026.09.01 ~ 2031.08.30", fill=(30, 30, 30), font=f_meta_kr)

    draw.text((meta_x, 875), "대한위대장내시경학회는 위와 같이", fill=(20, 20, 20), font=f_body_kr)
    draw.text((meta_x, 945), f"{kr_specialty} 자격을 인정함.", fill=(20, 20, 20), font=f_body_kr)

    # --- RIGHT COLUMN (English) ---
    draw.text((right_cx, 350), "Certificate of Qualification", fill=(25, 25, 25), font=f_title_en, anchor="mm")
    draw.text((right_cx, 440), "Park Sang Woo", fill=(25, 25, 25), font=f_name_en, anchor="mm")
    draw.line([(right_cx - 180, 495), (right_cx + 180, 495)], fill=(215, 185, 115), width=1)

    draw.text((right_cx, 600), "This is to certify that", fill=(50, 50, 50), font=f_body_en1, anchor="mm")
    draw.text((right_cx, 660), "The Korean Society of Digestive Endoscopy", fill=(25, 25, 25), font=f_body_en_soc, anchor="mm")
    draw.text((right_cx, 725), "acknowledges the above-mentioned as", fill=(50, 50, 50), font=f_body_en2, anchor="mm")
    draw.text((right_cx, 800), en_specialty, fill=(20, 20, 20), font=f_spec_en, anchor="mm")

    # Bottom accent lines
    draw.line([(W // 2 - 200, 1140), (W // 2 + 200, 1140)], fill=(195, 155, 65), width=2)
    draw.line([(W // 2 - 100, 1148), (W // 2 + 100, 1148)], fill=(195, 155, 65), width=1)

    im.save(output_path, quality=95)
    print(f"Generated {output_path} successfully!")

if __name__ == "__main__":
    create_clean_ksde_cert("gastro", "images/sangwoo-gastroscopy-specialist-certificate.jpg")
    create_clean_ksde_cert("colono", "images/sangwoo-colonoscopy-specialist-certificate.jpg")

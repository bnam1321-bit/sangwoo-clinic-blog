from PIL import Image, ImageEnhance, ImageFilter
import numpy as np

def clean_and_dewarp(src_path, dst_path, pts, target_size, is_horizontal=False):
    im = Image.open(src_path)
    # QUAD in PIL: (x_tl, y_tl, x_bl, y_bl, x_br, y_br, x_tr, y_tr)
    warped = im.transform(target_size, Image.Transform.QUAD, pts, Image.Resampling.BICUBIC)
    
    # Color & contrast enhancement to remove lighting gradient and make text crisp
    arr = np.array(warped, dtype=float)
    
    # Stretch channels to give clean white background
    for c in range(3):
        p_low = np.percentile(arr[:,:,c], 2)
        p_high = np.percentile(arr[:,:,c], 96)
        if p_high > p_low:
            arr[:,:,c] = np.clip((arr[:,:,c] - p_low) / (p_high - p_low) * 238 + 12, 0, 255)
    
    res = Image.fromarray(arr.astype('uint8'))
    
    # Sharpness enhancement
    enh_sharp = ImageEnhance.Sharpness(res)
    res = enh_sharp.enhance(1.3)
    
    # Slight color saturation boost
    enh_col = ImageEnhance.Color(res)
    res = enh_col.enhance(1.05)
    
    res.save(dst_path, quality=95)
    print(f"Processed: {dst_path} ({target_size})")

# Image 1: Diabetes Grade 1
clean_and_dewarp(
    'C:/Users/bnam1/.gemini/antigravity/brain/08b6149d-e8b7-4d3c-afb0-c7c8ec07e6e0/.user_uploaded/media_1790492748721.jpg',
    'images/sangwoo-diabetes-grade1-certificate.jpg',
    (92, 72, 136, 908, 703, 905, 730, 16),
    (750, 1060),
    is_horizontal=False
)

# Image 2: Hypertension Grade 1
clean_and_dewarp(
    'C:/Users/bnam1/.gemini/antigravity/brain/08b6149d-e8b7-4d3c-afb0-c7c8ec07e6e0/.user_uploaded/media_1790492748724.jpg',
    'images/sangwoo-hypertension-grade1-certificate.jpg',
    (128, 52, 146, 928, 724, 926, 756, 16),
    (750, 1060),
    is_horizontal=False
)

# Image 3: Gastroscopy Specialist
clean_and_dewarp(
    'C:/Users/bnam1/.gemini/antigravity/brain/08b6149d-e8b7-4d3c-afb0-c7c8ec07e6e0/.user_uploaded/media_1790492748756.jpg',
    'images/sangwoo-gastroscopy-specialist-certificate.jpg',
    (236, 148, 268, 666, 808, 678, 836, 164),
    (1050, 742),
    is_horizontal=True
)

# Image 4: Colonoscopy Specialist
clean_and_dewarp(
    'C:/Users/bnam1/.gemini/antigravity/brain/08b6149d-e8b7-4d3c-afb0-c7c8ec07e6e0/.user_uploaded/media_1790492748776.jpg',
    'images/sangwoo-colonoscopy-specialist-certificate.jpg',
    (184, 144, 210, 664, 834, 670, 862, 148),
    (1050, 742),
    is_horizontal=True
)

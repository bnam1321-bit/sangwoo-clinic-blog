import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

def get_homography(src_pts, dst_pts):
    # 4 points: [(x0,y0), (x1,y1), (x2,y2), (x3,y3)]
    # dst_pts: [(0,0), (w,0), (w,h), (0,h)]
    # Solve for 8 parameters of perspective transform
    matrix = []
    for (sx, sy), (dx, dy) in zip(src_pts, dst_pts):
        matrix.append([sx, sy, 1, 0, 0, 0, -dx*sx, -dx*sy])
        matrix.append([0, 0, 0, sx, sy, 1, -dy*sx, -dy*sy])
    A = np.array(matrix, dtype=float)
    B = np.array(dst_pts).reshape(8)
    res = np.linalg.solve(A, B)
    return res

print("Homography helper ready")

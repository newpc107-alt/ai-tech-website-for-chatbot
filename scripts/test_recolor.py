import sys, colorsys, os, subprocess

def recolor_ppm(input_jpg, output_jpg, hue_shift=0.0, target_sat_mult=1.0, val_mult=1.0, min_sat=0.06):
    ppm_temp = "/tmp/temp_in.ppm"
    ppm_out = "/tmp/temp_out.ppm"
    
    # 1. Convert jpg to ppm using ImageMagick
    subprocess.run(["convert", input_jpg, ppm_temp], check=True)
    
    with open(ppm_temp, "rb") as f:
        # Read PPM header
        magic = f.readline().strip()
        line = f.readline().strip()
        while line.startswith(b"#"):
            line = f.readline().strip()
        width, height = map(int, line.split())
        maxval = int(f.readline().strip())
        raw_bytes = bytearray(f.read())
    
    # Process pixels
    n_pixels = width * height
    for i in range(0, n_pixels * 3, 3):
        r = raw_bytes[i] / 255.0
        g = raw_bytes[i+1] / 255.0
        b = raw_bytes[i+2] / 255.0
        
        h, s, v = colorsys.rgb_to_hsv(r, g, b)
        
        # Only adjust colored pixels (protect white/gray/black neutral background)
        if s >= min_sat:
            if hue_shift != 0.0:
                h = (h + hue_shift) % 1.0
            s = max(0.0, min(1.0, s * target_sat_mult))
            v = max(0.0, min(1.0, v * val_mult))
            
            nr, ng, nb = colorsys.hsv_to_rgb(h, s, v)
            raw_bytes[i] = int(nr * 255)
            raw_bytes[i+1] = int(ng * 255)
            raw_bytes[i+2] = int(nb * 255)
        else:
            # Neutral background or neutral elements
            if val_mult != 1.0 and (v < 0.95 or s > 0.02):
                v = max(0.0, min(1.0, v * val_mult))
                nr, ng, nb = colorsys.hsv_to_rgb(h, s, v)
                raw_bytes[i] = int(nr * 255)
                raw_bytes[i+1] = int(ng * 255)
                raw_bytes[i+2] = int(nb * 255)
                
    with open(ppm_out, "wb") as f:
        f.write(f"P6\n{width} {height}\n255\n".encode())
        f.write(raw_bytes)
        
    subprocess.run(["convert", ppm_out, "-quality", "95", output_jpg], check=True)
    if os.path.exists(ppm_temp): os.remove(ppm_temp)
    if os.path.exists(ppm_out): os.remove(ppm_out)
    print("Done:", output_jpg)

# Test Product 13
recolor_ppm("public/images/braided_usbc_cable_blue_1793219803382.jpg", "public/images/editions/p13_silver_gray.jpg", target_sat_mult=0.08, val_mult=1.05)
recolor_ppm("public/images/braided_usbc_cable_blue_1793219803382.jpg", "public/images/editions/p13_navy_braided.jpg", hue_shift=0.02, target_sat_mult=1.2, val_mult=0.72)

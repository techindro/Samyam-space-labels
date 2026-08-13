import io
import os
import urllib.request
import base64

try:
    import cv2
    import numpy as np
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False

class AnonymizeService:
    def __init__(self):
        # In a real production environment, these would be downloaded or bundled.
        # We initialize paths to Haar cascade XML files.
        self.face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml' if OPENCV_AVAILABLE else None
        self.plate_cascade_path = cv2.data.haarcascades + 'haarcascade_russian_plate_number.xml' if OPENCV_AVAILABLE else None
        
        if OPENCV_AVAILABLE:
            self.face_cascade = cv2.CascadeClassifier(self.face_cascade_path)
            self.plate_cascade = cv2.CascadeClassifier(self.plate_cascade_path)

    def process_image(self, image_url: str) -> str:
        """
        Fetches an image from a URL, detects faces and license plates,
        blurs them, and returns a base64 encoded string of the processed image.
        If OpenCV is not installed, it returns a simulated response.
        """
        if not OPENCV_AVAILABLE:
            # Fallback for demo environments where cv2 is not installed
            print("Warning: OpenCV not installed. Returning mocked anonymization.")
            return "data:image/jpeg;base64,mocked_base64_string_for_demo_purposes_only"

        try:
            # 1. Download image
            req = urllib.request.urlopen(image_url)
            arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
            img = cv2.imdecode(arr, -1) # 'Load it as it is'
            
            if img is None:
                raise ValueError("Could not decode image from URL")

            # 2. Convert to grayscale for detection
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # 3. Detect and blur faces
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
            for (x, y, w, h) in faces:
                # Extract region of interest
                roi = img[y:y+h, x:x+w]
                # Apply Gaussian Blur
                roi = cv2.GaussianBlur(roi, (99, 99), 30)
                # Put blurred region back
                img[y:y+h, x:x+w] = roi

            # 4. Detect and blur license plates
            plates = self.plate_cascade.detectMultiScale(gray, 1.1, 4)
            for (x, y, w, h) in plates:
                roi = img[y:y+h, x:x+w]
                roi = cv2.GaussianBlur(roi, (55, 55), 20)
                img[y:y+h, x:x+w] = roi

            # 5. Encode back to base64
            _, buffer = cv2.imencode('.jpg', img)
            base64_img = base64.b64encode(buffer).decode('utf-8')
            return f"data:image/jpeg;base64,{base64_img}"

        except Exception as e:
            print(f"Anonymization Error: {e}")
            # In case of error, fail safe by returning nothing or a placeholder
            return ""

anonymize_engine = AnonymizeService()

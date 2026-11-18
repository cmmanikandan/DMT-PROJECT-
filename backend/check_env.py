try:
    import fastapi
    print("fastapi:", fastapi.__version__)
except Exception as e:
    print("fastapi: NOT INSTALLED", e)

try:
    import pandas
    print("pandas:", pandas.__version__)
except Exception as e:
    print("pandas: NOT INSTALLED", e)

try:
    import sklearn
    print("sklearn:", sklearn.__version__)
except Exception as e:
    print("sklearn: NOT INSTALLED", e)

try:
    import uvicorn
    print("uvicorn:", uvicorn.__version__)
except Exception as e:
    print("uvicorn: NOT INSTALLED", e)

# 使用说明


# 1.从github 

# 2.配置 vehicle_detector_config.py，修改path为本机"models/research","models/research/object_detection"的路径
```python
sys.path.append("D:/Users/Documents/AI/ThirdParty/models/research")
sys.path.append("D:/Users/Documents/AI/ThirdParty/models/research/object_detection")
```

## 运行PC端GUI
```sh
python vehicle_main.py
```

## 运行微信小程序服务器
```sh
python vehicle_server.py
```
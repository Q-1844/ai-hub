import requests
import json

# API配置
API_URL = "https://apis.iflow.cn/v1/chat/completions"
API_KEY = "sk-568e97a528aed87ecf6bcb7ef608663f"

# 测试模型
TEST_MODEL = "glm-4.6"

# 测试消息
TEST_MESSAGES = [
    {"role": "system", "content": "你好！我是你的AI聊天助手，有什么可以帮助你的吗？"},
    {"role": "user", "content": "你好，能告诉我今天天气怎么样吗？"}
]

def test_model():
    print(f"测试模型: {TEST_MODEL}")
    print(f"API地址: {API_URL}")
    print("=" * 50)
    
    # 构建请求体
    payload = {
        "model": TEST_MODEL,
        "messages": TEST_MESSAGES,
        "stream": False,
        "max_tokens": 512
    }
    
    # 构建请求头
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    try:
        # 发送请求
        response = requests.post(API_URL, headers=headers, json=payload)
        
        print(f"响应状态码: {response.status_code}")
        print(f"响应头: {dict(response.headers)}")
        print("=" * 50)
        
        # 解析响应
        response_data = response.json()
        print("完整响应数据:")
        print(json.dumps(response_data, ensure_ascii=False, indent=2))
        print("=" * 50)
        
        # 尝试提取回复
        reply = ""
        
        # 检查是否有choices
        if "choices" in response_data and isinstance(response_data["choices"], list):
            print(f"检测到choices数组，长度: {len(response_data['choices'])}")
            for i, choice in enumerate(response_data["choices"]):
                print(f"choice[{i}] keys: {list(choice.keys())}")
                
                # 尝试多种字段
                if "message" in choice and "content" in choice["message"]:
                    reply = choice["message"]["content"]
                    print(f"从choice[{i}].message.content获取到回复: {reply}")
                    break
                elif "text" in choice:
                    reply = choice["text"]
                    print(f"从choice[{i}].text获取到回复: {reply}")
                    break
                elif "delta" in choice and "content" in choice["delta"]:
                    reply = choice["delta"]["content"]
                    print(f"从choice[{i}].delta.content获取到回复: {reply}")
                    break
        
        # 检查其他可能的字段
        if not reply:
            if "content" in response_data:
                reply = response_data["content"]
                print(f"从response.content获取到回复: {reply}")
            elif "data" in response_data:
                data = response_data["data"]
                if isinstance(data, dict):
                    if "content" in data:
                        reply = data["content"]
                        print(f"从response.data.content获取到回复: {reply}")
                    elif "text" in data:
                        reply = data["text"]
                        print(f"从response.data.text获取到回复: {reply}")
            elif "result" in response_data:
                result = response_data["result"]
                if isinstance(result, dict):
                    if "content" in result:
                        reply = result["content"]
                        print(f"从response.result.content获取到回复: {reply}")
                    elif "text" in result:
                        reply = result["text"]
                        print(f"从response.result.text获取到回复: {reply}")
        
        if reply:
            print(f"\n最终提取到的回复: {reply}")
        else:
            print("\n❌ 未能提取到回复内容")
            print("可能的原因:")
            print("1. 模型名称不正确")
            print("2. API密钥无效或权限不足")
            print("3. 模型服务暂时不可用")
            print("4. 响应格式与预期不符")
            
    except Exception as e:
        print(f"\n❌ 测试过程中发生错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_model()
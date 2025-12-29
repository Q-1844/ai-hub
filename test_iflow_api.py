import requests
import json

# iFlow API配置
API_KEY = 'sk-568e97a528aed87ecf6bcb7ef608663f'
API_URL = 'https://apis.iflow.cn/v1/chat/completions'

# 测试请求
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {API_KEY}'
}

payload = {
    'model': 'tstars2.0',  # 使用正确的模型名称（小写，无连字符）
    'messages': [
        {'role': 'user', 'content': '你好，介绍一下自己'}
    ],
    'stream': False,
    'max_tokens': 512
}

print('正在测试iFlow API...')
print(f'API URL: {API_URL}')
print(f'模型: tstars2.0')
print('-' * 50)

try:
    response = requests.post(API_URL, headers=headers, json=payload)
    print(f'响应状态码: {response.status_code}')
    print(f'响应头: {dict(response.headers)}')
    
    # 尝试解析JSON响应
    response_data = response.json()
    print(f'响应数据: {json.dumps(response_data, indent=2, ensure_ascii=False)}')
    
    if response.ok:
        # 提取AI回复
        ai_reply = response_data.get('choices', [{}])[0].get('message', {}).get('content', '无回复内容')
        print('\n✅ API调用成功！')
        print(f'💬 AI回复: {ai_reply}')
    else:
        print('\n❌ API调用失败')
        print(f'错误信息: {response_data.get("error", {}).get("message", "未知错误")}')
        
except requests.exceptions.RequestException as e:
    print(f'\n❌ 请求异常: {e}')
except json.JSONDecodeError as e:
    print(f'\n❌ JSON解析错误: {e}')
    print(f'原始响应: {response.text}')

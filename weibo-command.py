#encoding: utf-8

import urllib2
import urllib
import time
import subprocess
from weibo import APIClient

APP_KEY='804868918'
APP_SECRET='9a8f210d052455552fde8b6deaa3a148'
CALLBACK_URL='https://api.weibo.com/oauth2/default.html' #需要在app注册里面设置好
AUTH_URL='https://api.weibo.com/oauth2/authorize' #固定的地址
SOME_CODE = 1
USERID='supery_ky@sina.com'
PASSWD='153381523'

def main():
    '''获取用户第一条评论，当第一条微博改变时，进行命令执行，并在微博评论处返回执行信息'''

    client=APIClient(APP_KEY,APP_SECRET,CALLBACK_URL)
    url = client.get_authorize_url() # redirect the user to 'url'
    print url
    #获得url，进行浏览器调用，手动的，呵呵！
    #获得code
    code = 'd624fa7b15d139c453023f4b70731e79'
    #r=client.request_access_token(code) #这个调用对于一个code只能执行一次
    #但是返回的r.access_token都是一样的，可以将token记录下来，隔一段时间再调用一次
    #access_token = r.access_token # 新浪返回的token，类似abc123xyz456
    #如果过期了，需要将上面的几步再执行一次获得新的access_token，并手动替换
    access_token = '2.00F9dUnB0kKJTs9164339a26ROiY8B'
    
    #print access_token
    #expires_in = r.expires_in # token过期的UNIX时间：http://zh.wikipedia.org/wiki/UNIX%E6%97%B6%E9%97%B4
# TODO: 在此可保存access token
    #print expires_in
    expires_in=1614153145
    client.set_access_token(access_token,expires_in)

    UID = client.account.get_uid.get()['uid'] #获取用户UID
    print 'user id is:',UID
    status=client.users.show.get(uid=UID)['status'] #获取用户最近微博
    current_status = status
    
    while True:
        current_status = client.users.show.get(uid=UID)['status']
        current_text=current_status['text']
        current_id=current_status['id']

        print time.ctime(),current_text

        if current_id!=status['id'] and current_text:
            commanderror=0
            try:
                tmp=subprocess.check_output(current_text,shell=True)
            except:
                commanderror=1
            if commanderror==0:
                tmp=tmp[:140] #140字限制
                if tmp=='':
                    tmp=current_text + ': success'
                client.comments.create.post(id=current_id,comment=tmp)
                print tmp
            status = current_status

        time.sleep(10) #ip限制1000次/小时    
    return 0

if __name__=='__main__':
    main()

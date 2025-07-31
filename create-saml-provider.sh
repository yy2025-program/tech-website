#!/bin/bash

echo "🔧 创建基本的SAML Identity Provider"
echo "================================="

# 创建一个基本的SAML元数据文件
cat > saml-metadata.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" 
                     entityID="https://logistics-hub-test">
    <md:IDPSSODescriptor WantAuthnRequestsSigned="false" 
                         protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <md:KeyDescriptor use="signing">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:X509Data>
                    <ds:X509Certificate>MIICXjCCAcegAwIBAgIJAKS0mGGmU9NEMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMTQwNzE0MTQzNjQzWhcNMTUwNzE0MTQzNjQzWjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYK8imMuRi/03z0K1Zi0WnvfFHvwlYeyK9Na6XJYaUoIDAtB92kWdGMdAQhLciHnAjkXLI6W15OoV3gA/ElRZ1xUpxTMhjP6PyY5wqT5r6y8FxbiiFKKAnHmUcrgfVW28tQ1hviTipzSNqL9FtpP3jRRJuwpQHX/BXZ6OmqQdZWwIDAQABo1AwTjAdBgNVHQ4EFgQUZqYW5Gvv9i7HvWVlMQxOGMy7u90wHwYDVR0jBBgwFoAUZqYW5Gvv9i7HvWVlMQxOGMy7u90wDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOBgQCmmpy2WKfkdseQ8q0BXhqKWmpYodz98SXKfVMdqKHnyafCsez9VdWAjLuNSdGHlIJklWHXs2EUOOquwTJq3xzHjn9dt5Uu2+ucpMh4jQwf7Ps2Ly+Y4+lobaFT7109HwEOXOdL7juXwTYdGjQlRK5TdIqHEml8vQjfHuTtT7I8VQ==</ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </md:KeyDescriptor>
        <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" 
                                Location="https://logistics-hub-test/sso"/>
    </md:IDPSSODescriptor>
</md:EntityDescriptor>
EOF

echo "📝 创建SAML Identity Provider..."

# 创建SAML Identity Provider
PROVIDER_NAME="LogisticsHubSAMLProvider"

aws iam create-saml-provider \
    --name $PROVIDER_NAME \
    --saml-metadata-document file://saml-metadata.xml

if [ $? -eq 0 ]; then
    echo "✅ SAML Identity Provider 创建成功"
    
    # 获取Provider ARN
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    PROVIDER_ARN="arn:aws:iam::$ACCOUNT_ID:saml-provider/$PROVIDER_NAME"
    
    echo "Provider ARN: $PROVIDER_ARN"
    echo ""
    echo "📋 现在你可以在Amazon Q Business中选择这个Identity Provider了"
    
else
    echo "❌ 创建失败，可能是权限问题"
    echo "请检查是否有 iam:CreateSAMLProvider 权限"
fi

# 清理临时文件
rm -f saml-metadata.xml

echo ""
echo "🎯 下一步："
echo "1. 刷新Amazon Q Business配置页面"
echo "2. 在Identity Provider下拉菜单中选择: $PROVIDER_NAME"
echo "3. 继续配置其他选项"

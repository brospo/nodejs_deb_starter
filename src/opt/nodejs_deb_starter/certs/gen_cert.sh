set -e

# Gather information
echo 'You are about to be asked to enter information that will be incorporated
into your certificate request. What you are about to enter is what is called a
Distinguished Name or a DN. There are quite a few fields but you can leave some blank
For some fields there will be a default value, If you enter '.', the field will be left blank.'

echo -n 'Country Name (2 letter code) [AU]: '; read country
echo -n 'State or Province Name (full name) [Some-State]: '; read state
echo -n 'Locality Name (eg, city) []: '; read city
echo -n 'Organization Name (eg, company) [Internet Widgits Pty Ltd]: '; read company
echo -n 'Organizational Unit Name (eg, section) []: '; read section
echo -n 'Is External Address DNS or IP (Valid entries are [DNS|IP] ) []: '; read san_type
echo -n 'External Address []: '; read common_name
echo -n 'Email Address []: '; read email

# Create private.pem and offcorp_acvs_web.csr
openssl req -new -newkey rsa:2048 -keyout private.pem -nodes -sha256 -out ./nodejs_deb_starter.csr -subj "/C=$country/ST=$state/L=$city/O=$company/OU=$section/CN=$common_name/emailAddress=$email" -config <(
cat <<-EOF
[req]
default_bits = 2048
default_md = sha256
req_extensions = req_ext
distinguished_name = dn
[ dn ]
[ req_ext ]
subjectAltName = @alt_names
[alt_names]
IP.1  = 127.0.0.1
DNS.1 = localhost
$san_type.2  = $common_name
EOF
)

# Print the contents of the cert
echo "Certificate Signing request nodejs_deb_starter.csr generated!"
# openssl req -text -noout -verify -in ./nodejs_deb_starter.csr

read -p "Do you want to self-sign this certificate? [y/N] " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    openssl x509 -req -days 365 -in ./nodejs_deb_starter.csr -signkey ./private.pem -out ./nodejs_deb_starter.pem
fi

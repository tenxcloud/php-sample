FROM zadoev/apache-php5.3-commited

RUN apt-get update && \
    apt-get -y install php5-curl

ADD ZendGuardLoader-php-5.3-linux-glibc23-x86_64/php-5.3.x/ZendGuardLoader.so /usr/zend/
ADD ibos/upload/. /var/www/upload
#ADD wherephp.php /var/www/upload/wherephp.php
ADD php.ini /etc/php5/apache2/php.ini
ADD run.sh /run.sh

RUN chmod +x /run.sh
RUN chmod -R  777 /var/www/upload/data
RUN chmod -R  777 /var/www/upload/system/config
RUN chmod -R  777 /var/www/upload/static

EXPOSE 80

CMD ["/run.sh"]
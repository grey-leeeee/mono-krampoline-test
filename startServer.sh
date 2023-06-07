service mysql restart
(cd /goormService/backend && ./gradlew build -x test)
java -jar /goormService/backend/build/libs/kakao-0.0.1-SNAPSHOT.jar
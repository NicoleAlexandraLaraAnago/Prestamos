# Usa una imagen base de OpenJDK
FROM openjdk:17-jdk-slim

# Copia el archivo JAR de la aplicación (compilado en el paso de construcción) al contenedor
# Se asume que el archivo JAR está en la carpeta /target (para Maven) o /build/libs (para Gradle)
WORKDIR /app
COPY target/cursos-0.0.1-SNAPSHOT.jar app.jar
# Define el puerto que usará la aplicación
EXPOSE 8002

# Ejecuta la aplicación cuando el contenedor se inicie
ENTRYPOINT ["java", "-jar", "app.jar"]


FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy the project files into the container
COPY pom.xml .
COPY src ./src

# Run the maven build command
RUN mvn clean package -DskipTests

# We use a lightweight Java image to actually run the app
FROM openjdk:17-jdk-slim
WORKDIR /app


COPY --from=build /app/target/*.jar app.jar

# Open port 8080
EXPOSE 8080

# The command to start the app
ENTRYPOINT ["java", "-jar", "app.jar"]
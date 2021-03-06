
![Java CI](https://github.com/Sfullez/SimpleTodoApp/workflows/Java%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/Sfullez/SimpleTodoApp/badge.svg?branch=master)](https://coveralls.io/github/Sfullez/SimpleTodoApp?branch=master)\
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Sfullez_SimpleTodoApp&metric=alert_status)](https://sonarcloud.io/dashboard?id=Sfullez_SimpleTodoApp)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Sfullez_SimpleTodoApp&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=Sfullez_SimpleTodoApp)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Sfullez_SimpleTodoApp&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=Sfullez_SimpleTodoApp)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Sfullez_SimpleTodoApp&metric=security_rating)](https://sonarcloud.io/dashboard?id=Sfullez_SimpleTodoApp)\
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=Sfullez_SimpleTodoApp&metric=sqale_index)](https://sonarcloud.io/dashboard?id=Sfullez_SimpleTodoApp)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Sfullez_SimpleTodoApp&metric=bugs)](https://sonarcloud.io/dashboard?id=Sfullez_SimpleTodoApp)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Sfullez_SimpleTodoApp&metric=code_smells)](https://sonarcloud.io/dashboard?id=Sfullez_SimpleTodoApp)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Sfullez_SimpleTodoApp&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=Sfullez_SimpleTodoApp)

Simple Todo Application developed using TDD and the tools/techniques seen at the Advanced Techniques and Tools for Software Development course at Università degli Studi di Firenze, using Maven and GitHub Workflows.

Here are the links for the [full project report](https://drive.google.com/file/d/1Nb0g3UDDVvrGajFhPv-w-8C6uohBWHue/view?usp=sharing) and the [FatJAR of the application](https://github.com/Sfullez/SimpleTodoApp/releases/download/0.0.1-SNAPSHOT/simpletodoapp.jar) (can also be found in the releases).

## Prerequisites
- Java 8
- Maven
- Docker (for the MongoDB container if you want to run the application as standalone)
- Docker Compose (for the MongoDB container if you want to run the application as standalone)

A GitHub repository is also required for Continuous Integration on GitHub Workflows, if you want to execute remotely tests, code coverage with Coveralls and code quality analysis with SonarCloud; otherwise, all tests, mutation testing and JaCoCo code coverage can also be executed locally during the Maven build. To execute code quality analysis locally, a [SonarQube](https://www.sonarqube.org/downloads/) installation is required and the plugin must be configured accordingly (more details on the [official documentation](https://docs.sonarqube.org/latest/)).

### How to setup a MongoDB docker container with a replica set (mandatory to try the application as standalone)
Since a MongoDB database with transactions support is **required** to try the application, here are the steps needed to setup a working MongoDB instance with its replica set, implying Docker and Docker Compose are already installed.

 1. `docker pull mongo:latest` to download the latest MongoDB docker image
 2. `docker-compose up` to create the MongoDB docker container instances and place them on the same Docker network

Then, we have to setup the replica set so that the two instances act as primary and secondary nodes. To do this, we connect to the Mongo shell of the primary node with `docker exec -it mongo-primary mongo` and we create the following configuration:

 1. `configuration = {"_id": "todoapp-replica-set", "members": [{"_id": 0, "host": "mongo-primary:27017"}, {"_id": 1, "host": "mongo-secondary:27017"}]}` creates a configuration with the two instances, from the set network, as nodes of the replica set
 2. `rs.initiate(configuration)` to initiate the replica set with the given configuration

Now the replica set has been initialized and configured and the application can be started. The replica set URl to pass to the application will be `mongodb://mongo-primary:27017`.

## Build with Maven
- `mvn clean verify` to simply run all tests
- `mvn clean verify org.pitest:pitest-maven:mutationCoverage` to run all tests and perform mutation testing

Add `-Pjacoco` to also generate the code coverage report made by Jacoco during the build process.
Note that the replica set setup is not needed for Maven builds, since all tests use Testcontainers for the MongoDB database instance.

### Run the application
Once the application has been packaged with `mvn clean package`, the .jar contaning backend and frontend can be found in `/simpletodoapp-gui/target`. Use `java -jar <path_to_jar> [options]` to run the application: as a reminder, you need a MongoDB replica set to run this as standalone (see previous dedicated section).
| Option name | Description |
|-|-|
| `--mongo-url` | URL of the replica set, by default `mongodb://mongo-primary:27017`; obtainable as `mongodb://[primary_node_name]:[primary_node_port_number]` |
| `--db-name` | Database name, as specified during the replica set setup phase, by default `todoapp` |
| `--db-tasksCollection` | Name of the tasks collection in the database, by default `tasks` |
| `--db-tagsCollection` | Name of the tags collection in the database, by default `tags` |

## Continuous integration
The .yml workflow file to perform continuous integration on the project with GitHub Workflows is provided in the repository; if you want to also check the Coveralls and Sonarcloud status, some environment variables need to be modified inside the .yml workflow file:

 - `SONAR_PROJECT`: given by Sonarcloud during the initialization phase
 - `SONAR_ORGANIZATION`: given by Sonarcloud during the initialization phase
 - `SONAR_URL`: given by Sonarcloud during the initialization phase
 - `SONAR_TOKEN`: given by Sonarcloud during the initialization phase; this needs to be set as a GitHub Secret
 - `GITHUB_TOKEN`: set by default by GitHub as secret
 - `COVERALLS_TOKEN`: given by Coveralls during the initialization phase; this needs to be set as a GitHub Secret

To setup a token/key as secret in GitHub, simply go to the repository **Settings** and then select **Secrets**; alternatively, if code quality and coverage analyses are not needed, simply remove the `sonar:sonar coveralls:report` goals from the Maven build inside the .yml workflow file.

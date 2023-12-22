import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Culqui API')
    .setDescription('Esta API es un reto tecnico para la empresa Culqui, la cual consiste en un servicio de tipo de cambio de monedas.')
    .setVersion('1.0')
    .addTag('Culqui API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(9876);
}
bootstrap();

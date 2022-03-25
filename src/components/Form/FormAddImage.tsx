import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
     
      required: 'Arquivo obrigatório',

      validate: {
        lessThan10MB: file => file[0]?.size < 10485760  || 
        'O arquivo deve ser menor que 10MB',

        accepetedFormats: file =>    /image\/(jpeg|png|gif)/.test(file[0].type) || 
        'Somente são aceitos arquivos PNG, JPEG e GIF' ,
      },
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
     
      required: 'Título obrigatório',
      minLength: title => title.length >= 2 || 'Mínimo de 2 caracteres',
      maxLength: title => title.length <= 20 || 'Máximo de 20 caracteres'
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS

      required: 'Descrição obrigatória',
      maxLength: description => description.length <= 65 || 'Máximo de 65 caracteres'
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
     formData => {
      return  api.post('api/images', formData)
    },  

    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries()
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      console.log(data)
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          position: 'top-right',
          isClosable: true,
          duration: 5000,
          
        })

        return
      }


      // TODO EXECUTE ASYNC MUTATION

      await mutation.mutateAsync()

      // TODO SHOW SUCCESS TOAST

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        position: 'top-right',
        isClosable: true,
        duration: 5000,
        
      })

    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        position: 'top-right',
        isClosable: true,
        duration: 5000,
        
      })
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      closeModal()
      setLocalImageUrl('')
      setImageUrl('')
      reset()
    }
  };
  


  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // TODO SEND IMAGE ERRORS
          error={errors.image}
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register('image', formValidations.image)}

        />

        <TextInput
          placeholder="Título da imagem..."
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          {...register('title')}
          error={errors.title}

        />

        <TextInput
          placeholder="Descrição da imagem..."
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register('description')}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}

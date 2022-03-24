import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return(

    <Modal isOpen={isOpen} onClose={onClose}   >
    <ModalOverlay />
        <ModalContent 
        maxH={600}
        maxW='fit-content'
        >
        <ModalBody 
        bgColor={'pGray.800'}
        p={0}
        >

            <Image 
            src={imgUrl} 
            maxW={900}
            maxH={600}
            />
        </ModalBody>
        <ModalFooter 
        bgColor={'pGray.800'} 
        justifyContent='flex-start' 
        paddingBottom='0.25rem' 
        paddingTop='0.25rem'
        >
          <Link href={imgUrl} isExternal fontSize='0.8rem'>
            <p>Abrir original</p>
          </Link>
        </ModalFooter>
        </ModalContent>
  </Modal>
    )

}

import _ from 'lodash'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faLocation from '@fortawesome/fontawesome-pro-light/faMapMarkerAlt'
import faPhone from '@fortawesome/fontawesome-pro-light/faMobileAndroid'
import faMail from '@fortawesome/fontawesome-pro-light/faEnvelope'
import Container, {
  ListingInfo,
  ListingImage,
  ListingDetails,
  ReceiverInfo
} from './styles'
import {mainListingThumbnail} from 'utils/image_url'
import UserAvatar from 'components/shared/User/Avatar'

export default ({listing, receiver}) => (
  <Container>
    <ListingInfo>
      <ListingImage image={mainListingThumbnail(listing.images || [])} />
      <ListingDetails>
        <FontAwesomeIcon icon={faLocation} />
        <span>{`${listing.address.street}, ${
          listing.address.neighborhood
        }`}</span>
      </ListingDetails>
    </ListingInfo>
    {receiver && (
      <ReceiverInfo>
        <UserAvatar user={receiver} />
        <p>
          {receiver.name
            .split(' ')
            .map((name) => _.upperFirst(name))
            .join(' ')}
        </p>
        <div className="user-detail">
          <FontAwesomeIcon icon={faPhone} />
          <span>{receiver.phone || 'Não informado'}</span>
        </div>
        <div className="user-detail">
          <FontAwesomeIcon icon={faMail} />
          <span>{receiver.email}</span>
        </div>
      </ReceiverInfo>
    )}
  </Container>
)
